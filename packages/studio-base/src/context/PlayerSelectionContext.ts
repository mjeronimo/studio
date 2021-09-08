// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { createContext, useContext } from "react";

import { Player } from "@foxglove/studio-base/players/types";

export type DataSource = {
  id: string;
  displayName: string;
  iconName?: string;
  disabledReason?: string | JSX.Element;
  badgeText?: string;

  // Return the UI element for the data source
  ui: () => JSX.Element;
};

export interface PlayerSelection {
  /** Set the current data source */
  setDataSource: (source: DataSource) => void;
  /** Set the player */
  setPlayer: (player: Player) => void;

  /** Any currently selected data source */
  currentDataSource?: DataSource;

  /** available data sources */
  availableDataSources: DataSource[];
}

const PlayerSelectionContext = createContext<PlayerSelection>({
  setDataSource: () => {},
  setPlayer: () => {},
  availableDataSources: [],
});

export function usePlayerSelection(): PlayerSelection {
  return useContext(PlayerSelectionContext);
}

export default PlayerSelectionContext;
