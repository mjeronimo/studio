// Copyright 2022 Open Source Robotics Foundation, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ReactFlowProvider } from 'react-flow-renderer';

import Panel from "@foxglove/studio-base/components/Panel";
import { SaveConfig } from "@foxglove/studio-base/types/panels";

import { SystemViewer } from "./SystemViewer";

type Props = {
  config: unknown;
  saveConfig: SaveConfig<unknown>;
}

const SystemViewPanel = (props: Props) => {
  return (
    <ReactFlowProvider>
      <SystemViewer />
    </ReactFlowProvider>
  )
};

SystemViewPanel.displayName = "SystemView";
SystemViewPanel.panelType = "SystemView";
SystemViewPanel.defaultConfig = {};
SystemViewPanel.supportsStrictMode = false;

export default Panel(SystemViewPanel);