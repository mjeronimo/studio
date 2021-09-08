// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";

import { useShallowMemo } from "@foxglove/hooks";
import { MessagePipelineProvider } from "@foxglove/studio-base/components/MessagePipeline";
import { useCurrentLayoutSelector } from "@foxglove/studio-base/context/CurrentLayoutContext";
import PlayerSelectionContext, {
  PlayerSelection,
  DataSource,
} from "@foxglove/studio-base/context/PlayerSelectionContext";
import { useUserNodeState } from "@foxglove/studio-base/context/UserNodeStateContext";
import { GlobalVariables } from "@foxglove/studio-base/hooks/useGlobalVariables";
import useWarnImmediateReRender from "@foxglove/studio-base/hooks/useWarnImmediateReRender";
import OrderedStampPlayer from "@foxglove/studio-base/players/OrderedStampPlayer";
import UserNodePlayer from "@foxglove/studio-base/players/UserNodePlayer";
import { Player } from "@foxglove/studio-base/players/types";
import { UserNodes } from "@foxglove/studio-base/types/panels";

const DEFAULT_MESSAGE_ORDER = "receiveTime";
const EMPTY_USER_NODES: UserNodes = Object.freeze({});
const EMPTY_GLOBAL_VARIABLES: GlobalVariables = Object.freeze({});

export default function PlayerManager({
  children,
  playerSources,
}: PropsWithChildren<{
  playerSources: DataSource[];
}>): JSX.Element {
  useWarnImmediateReRender();

  const { setUserNodeDiagnostics, addUserNodeLogs, setUserNodeRosLib } = useUserNodeState();
  const userNodeActions = useShallowMemo({
    setUserNodeDiagnostics,
    addUserNodeLogs,
    setUserNodeRosLib,
  });

  const messageOrder = useCurrentLayoutSelector(
    (state) => state.selectedLayout?.data?.playbackConfig.messageOrder,
  );
  const userNodes = useCurrentLayoutSelector((state) => state.selectedLayout?.data?.userNodes);
  const globalVariables = useCurrentLayoutSelector(
    (state) => state.selectedLayout?.data?.globalVariables ?? EMPTY_GLOBAL_VARIABLES,
  );

  const globalVariablesRef = useRef<GlobalVariables>(globalVariables);

  const [dataSource, setDataSource] = useState<DataSource | undefined>();
  const [basePlayer, setBasePlayer] = useState<Player | undefined>();
  //const isMounted = useMountedState();

  // We don't want to recreate the player when the message order changes, but we do want to
  // initialize it with the right order, so make a variable for its initial value we can use in the
  // dependency array below to defeat the linter.
  const [initialMessageOrder] = useState(messageOrder);

  /*
  const analytics = useAnalytics();
  const metricsCollector = useMemo(() => new AnalyticsMetricsCollector(analytics), [analytics]);

  const [unlimitedMemoryCache = false] = useAppConfigurationValue<boolean>(
    AppSetting.UNLIMITED_MEMORY_CACHE,
  );
  */

  /*
  const buildPlayerOptions: BuildPlayerOptions = useShallowMemo({
    unlimitedMemoryCache,
    metricsCollector,
  });
  */

  const player = useMemo<OrderedStampPlayer | undefined>(() => {
    if (!basePlayer) {
      return undefined;
    }

    const userNodePlayer = new UserNodePlayer(basePlayer, userNodeActions);
    const headerStampPlayer = new OrderedStampPlayer(
      userNodePlayer,
      initialMessageOrder ?? DEFAULT_MESSAGE_ORDER,
    );
    headerStampPlayer.setGlobalVariables(globalVariablesRef.current);
    return headerStampPlayer;
  }, [basePlayer, initialMessageOrder, userNodeActions]);

  useEffect(() => {
    player?.setMessageOrder(messageOrder ?? DEFAULT_MESSAGE_ORDER);
  }, [player, messageOrder]);
  useEffect(() => {
    player?.setUserNodes(userNodes ?? EMPTY_USER_NODES);
  }, [player, userNodes]);

  // fixme - save the id of the last selected source to show that source again on mount
  /*
  // restore the saved source on first mount
  useLayoutEffect(() => {
    if (savedSource) {
      void selectSource(savedSource, { restore: true });
    }
    // we only run the layout effect on first mount - never again even if the saved source changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  const value: PlayerSelection = {
    setDataSource: (source) => setDataSource(() => source),
    setPlayer: setBasePlayer,
    currentDataSource: dataSource,
    availableDataSources: playerSources,
  };

  return (
    <>
      <PlayerSelectionContext.Provider value={value}>
        <MessagePipelineProvider player={player} globalVariables={globalVariables}>
          {children}
        </MessagePipelineProvider>
      </PlayerSelectionContext.Provider>
    </>
  );
}
