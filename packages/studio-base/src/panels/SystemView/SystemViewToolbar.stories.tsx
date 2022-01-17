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

import { storiesOf } from "@storybook/react";
import { ReactFlowProvider } from 'react-flow-renderer';

import MockPanelContextProvider from "@foxglove/studio-base/components/MockPanelContextProvider";

import { SystemViewToolbar } from "./SystemViewToolbar";
import { initialNodes } from './initial-elements';

const containerStyle = {
  margin: 8,
  display: "inline-block",
};

const zoomIn = () => {
  console.log("zoomIn");
}

const zoomOut = () => {
  console.log("zoomOut");
}

const fitView = () => {
  console.log("fitView");
}

const interactiveChange = (isInteractive: boolean) => {
  console.log("interactiveChange: isInteractive: ", isInteractive);
}

const toggleOrientation = (lrOrientation: boolean) => {
  console.log("toggleOrientation: ", lrOrientation);
}

const SystemViewToolbarWrapper = (props: any) => (
  <div style={containerStyle}>
    <MockPanelContextProvider>
      <ReactFlowProvider>
        <SystemViewToolbar
          nodes={initialNodes}
          lrOrientation={true}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onInteractiveChange={interactiveChange}
          onToggleOrientation={toggleOrientation}
          onFitview={fitView}
        />
      </ReactFlowProvider>
    </MockPanelContextProvider>
  </div>
);

storiesOf("panels/SystemView/SystemViewToolbar", module)
  .add("Default", () => <SystemViewToolbarWrapper />)
