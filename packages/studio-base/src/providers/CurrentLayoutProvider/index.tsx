// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { isEqual } from "lodash";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { useAsync, useMountedState } from "react-use";
import { useDebouncedCallback } from "use-debounce";

import Logger from "@foxglove/log";
import { useAnalytics } from "@foxglove/studio-base/context/AnalyticsContext";
import CurrentLayoutContext, {
  LayoutState,
} from "@foxglove/studio-base/context/CurrentLayoutContext";
import { PanelsState } from "@foxglove/studio-base/context/CurrentLayoutContext/actions";
import { useLayoutStorage } from "@foxglove/studio-base/context/LayoutStorageContext";
import { useUserProfileStorage } from "@foxglove/studio-base/context/UserProfileStorageContext";
import CurrentLayoutState from "@foxglove/studio-base/providers/CurrentLayoutProvider/CurrentLayoutState";
import { LayoutID } from "@foxglove/studio-base/services/ILayoutStorage";

const log = Logger.getLogger(__filename);

function migrateLegacyLayoutFromLocalStorage() {
  let result: (Omit<PanelsState, "name"> & { name?: string }) | undefined;
  for (const key of ["webvizGlobalState", "studioGlobalState"]) {
    const value = localStorage.getItem(key);
    if (value != undefined) {
      const panels = JSON.parse(value)?.panels;
      if (panels != undefined) {
        result = panels;
      }
    }
    localStorage.removeItem(key);
  }
  return result;
}

/**
 * Once the initial layout has been determined, this component takes care of initializing the
 * CurrentLayoutState and subscribing to changes. This is done in a second step so that the
 * initialization of CurrentLayoutState can be delayed, to avoid undesired entries on the undo/redo
 * stack from a dummy initial state.
 */
function CurrentLayoutProviderWithInitialState({
  initialState,
  stateInstance,
  children,
}: React.PropsWithChildren<{ initialState: LayoutState; stateInstance: CurrentLayoutState }>) {
  const { addToast } = useToasts();

  const { setUserProfile } = useUserProfileStorage();
  const layoutStorage = useLayoutStorage();

  const isMounted = useMountedState();

  // If the current layout is not present in the layout store, deselect it
  useLayoutEffect(() => {
    const listener = async () => {
      const selectedId = stateInstance.actions.getCurrentLayoutState().selectedLayout?.id;
      // if we don't have a selected layout then we won't be able to find it in the stored layouts
      if (!selectedId) {
        return;
      }
      const existing = await layoutStorage.getLayouts();
      if (!isMounted()) {
        return;
      }
      if (!existing.some(({ id }) => id === selectedId)) {
        stateInstance.actions.setSelectedLayout(undefined);
      }
    };
    layoutStorage.addLayoutsChangedListener(listener);
    return () => layoutStorage.removeLayoutsChangedListener(listener);
  }, [isMounted, layoutStorage, stateInstance.actions]);

  const lastCurrentLayoutId = useRef(initialState.selectedLayout?.id);
  const previousSavedState = useRef<LayoutState | undefined>();
  const pendingSaveLayouts = useRef(new Map<LayoutID, PanelsState>());

  const queueSave = useDebouncedCallback(() => {
    for (const [id, data] of pendingSaveLayouts.current) {
      pendingSaveLayouts.current.delete(id);

      log.debug("updateLayout");
      layoutStorage
        .updateLayout({
          targetID: id,
          data,
          name: undefined,
        })
        .catch((error) => {
          log.error(error);
          addToast(`The current layout could not be saved. ${error.toString()}`, {
            appearance: "error",
            id: "CurrentLayoutProvider.layoutStorage.put",
          });
        });
    }
  }, 1_000 /* 1 second */);

  useLayoutEffect(() => {
    const currentState = stateInstance.actions.getCurrentLayoutState();
    // Skip initial save to LayoutStorage unless the layout changed since we initialized
    // CurrentLayoutState (e.g. for migrations)
    if (previousSavedState.current == undefined && isEqual(initialState, currentState)) {
      previousSavedState.current = currentState;
    }
    const listener = (state: LayoutState) => {
      // When a new layout is first selected, we don't need to save it back to storage
      if (state.selectedLayout?.id !== previousSavedState.current?.selectedLayout?.id) {
        previousSavedState.current = state;
        return;
      }

      if (state.selectedLayout) {
        pendingSaveLayouts.current.set(state.selectedLayout.id, state.selectedLayout.data);
        queueSave();
      }
    };
    stateInstance.addLayoutStateListener(listener);
    return () => stateInstance.removeLayoutStateListener(listener);
  }, [initialState, queueSave, stateInstance]);

  // Save the selected layout id to the UserProfile.
  useLayoutEffect(() => {
    const listener = (layoutState: LayoutState) => {
      if (layoutState.selectedLayout?.id === lastCurrentLayoutId.current) {
        return;
      }
      lastCurrentLayoutId.current = layoutState.selectedLayout?.id;
      log.debug("setUserProfile");
      setUserProfile({ currentLayoutId: layoutState.selectedLayout?.id }).catch((error) => {
        console.error(error);
        addToast(`The current layout could not be saved. ${error.toString()}`, {
          appearance: "error",
          id: "CurrentLayoutProvider.setUserProfile",
        });
      });
    };
    stateInstance.addLayoutStateListener(listener);
    return () => stateInstance.removeLayoutStateListener(listener);
  }, [setUserProfile, addToast, stateInstance]);

  return (
    <CurrentLayoutContext.Provider value={stateInstance}>{children}</CurrentLayoutContext.Provider>
  );
}

/**
 * Concrete implementation of CurrentLayoutContext.Provider which handles automatically saving and
 * restoring the current layout from LayoutStorage. Requires a LayoutStorage provider.
 */
export default function CurrentLayoutProvider({
  children,
}: React.PropsWithChildren<{ disableAnalyticsForTests?: boolean }>): JSX.Element | ReactNull {
  const { addToast } = useToasts();

  const { getUserProfile } = useUserProfileStorage();
  const layoutStorage = useLayoutStorage();

  const loadInitialState = useAsync(async (): Promise<LayoutState> => {
    try {
      // If a legacy layout exists in localStorage, prefer that.
      const legacyLayout = migrateLegacyLayoutFromLocalStorage();
      if (legacyLayout != undefined) {
        const { name = "unnamed", ...data } = legacyLayout;
        const newLayout = await layoutStorage.saveNewLayout({
          name,
          data,
          permission: "creator_write",
        });
        return { selectedLayout: { id: newLayout.id, data } };
      }
      // If the user's previously selected layout can be loaded, use it
      const { currentLayoutId } = await getUserProfile();
      if (currentLayoutId != undefined) {
        const layout = await layoutStorage.getLayout(currentLayoutId);
        if (layout != undefined) {
          return { selectedLayout: { id: layout.id, data: layout.data } };
        }
      }
      // Otherwise try to choose any available layout
      const allLayouts = await layoutStorage.getLayouts();
      if (allLayouts[0]) {
        const layout = await layoutStorage.getLayout(allLayouts[0].id);
        if (layout) {
          return { selectedLayout: { id: layout.id, data: layout.data } };
        }
      }
    } catch (error) {
      console.error(error);
      addToast(`The current layout could not be loaded. ${error.toString()}`, {
        appearance: "error",
        id: "CurrentLayoutProvider.load",
      });
    }
    return { selectedLayout: undefined };
  }, [addToast, getUserProfile, layoutStorage]);

  const analytics = useAnalytics();
  const initialState = useMemo(() => {
    return loadInitialState.value ?? { selectedLayout: undefined };
  }, [loadInitialState.value]);

  const stateInstance = useMemo(() => {
    if (loadInitialState.loading) {
      return undefined;
    }

    return new CurrentLayoutState(initialState, analytics);
  }, [analytics, initialState, loadInitialState.loading]);

  if (!stateInstance) {
    return ReactNull;
  }

  return (
    <CurrentLayoutProviderWithInitialState
      initialState={initialState}
      stateInstance={stateInstance}
    >
      {children}
    </CurrentLayoutProviderWithInitialState>
  );
}
