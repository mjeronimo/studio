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
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import { PanelConfigSchema, SaveConfig } from "@foxglove/studio-base/types/panels";

import { SystemViewer } from "./SystemViewer";
import { NodeGrouping, Orientation } from "./types";
import helpContent from "./index.help.md";

type SystemViewConfig = {
  orientation?: Orientation;
  nodeGrouping?: NodeGrouping;
  includeHiddenNodes: boolean;
  includeHiddenTopics: boolean;
  includeRosoutTopic: boolean;
  includeParameterEventsTopic: boolean;
}; 

const configSchema: PanelConfigSchema<SystemViewConfig> = [
  { key: "orientation", type: "dropdown", title: "Default Graph Orientation", options: [
    { 'value': Orientation.LeftToRight, 'text': 'Left to right' },
    { 'value': Orientation.TopToBottom, 'text': 'Top to bottom' },
  ]},
  { key: "nodeGrouping", type: "dropdown", title: "Default Node Grouping", options: [
    { 'value': NodeGrouping.Logical, 'text': 'Logical' },
    { 'value': NodeGrouping.Physical, 'text': 'Physical' },
    { 'value': NodeGrouping.None, 'text': 'None' },
  ]},
  { key: "includeHiddenNodes", type: "toggle", title: "Include hidden nodes" },
  { key: "includeHiddenTopics", type: "toggle", title: "Include hidden topics" },
  { key: "includeRosoutTopic", type: "toggle", title: "Include /rosout topic" },
  { key: "includeParameterEventsTopic", type: "toggle", title: "Include /parameter_events topic" },
];

const defaultConfig: SystemViewConfig = {
  orientation: Orientation.LeftToRight,
  nodeGrouping: NodeGrouping.Logical,
  includeHiddenNodes: false,
  includeHiddenTopics: false,
  includeRosoutTopic: false,
  includeParameterEventsTopic: false,
};

export type Props = {
  config: SystemViewConfig;
  saveConfig: SaveConfig<SystemViewConfig>;
}

const SystemViewPanel = (props: Props) => {
  return (
    <>
      <PanelToolbar floating helpContent={helpContent} />
      <ReactFlowProvider>
        <SystemViewer />
      </ReactFlowProvider>
    </>
  )
};

SystemViewPanel.displayName = "SystemView";
SystemViewPanel.panelType = "SystemView";
SystemViewPanel.defaultConfig = defaultConfig;
SystemViewPanel.supportsStrictMode = true;
SystemViewPanel.configSchema = configSchema;

export default Panel(SystemViewPanel);
