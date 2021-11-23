// Copyright 2021 Open Source Robotics Foundation, Inc.
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
import { EdgeData } from 'reaflow';
import MockPanelContextProvider from "@foxglove/studio-base/components/MockPanelContextProvider";
import SystemViewToolbar from "./SystemViewToolbar";
import { MyNodeData, NodeType } from "./MyNodeData";

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

const fitToWindow = () => {
  console.log("fitToWindow");
}

const toggleOrientation = () => {
  console.log("toggleOrientation");
}

const rosLogoURL = 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg';
const wirelessURL = 'https://raw.githubusercontent.com/mjeronimo/studio/develop/packages/studio-base/src/panels/SystemView/assets/wireless.svg';

const nodes: MyNodeData[] = [
  {
    id: '1', text: '/stereo_camera_controller',
    visible: true,
    type: NodeType.NODE,
    icon: {
      url: rosLogoURL,
      height: 25,
      width: 25,
    },
  },
  {
    id: '2', text: '/left/image_raw',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    },
  },
  {
    id: '3', text: '/right/image_raw',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    },
  },
];

const SystemViewToolbarWrapper = (props: any) => (
  <div style={containerStyle}>
    <MockPanelContextProvider>
      <SystemViewToolbar
        nodes={nodes}
        edges={[]}
        lrOrientation={true}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        toggleOrientation={toggleOrientation}
        fitToWindow={fitToWindow}
      />
    </MockPanelContextProvider>
  </div>
);

storiesOf("panels/SystemView/SystemViewToolbar", module)
  .add("Default", () => <SystemViewToolbarWrapper />)
