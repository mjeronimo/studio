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
import MockPanelContextProvider from "@foxglove/studio-base/components/MockPanelContextProvider";
import { NodeList } from "./NodeList";
import { MyNodeData, NodeType } from "./MyNodeData";

const rosLogoURL = 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg';
const wirelessURL = 'https://raw.githubusercontent.com/mjeronimo/studio/develop/packages/studio-base/src/panels/SystemView/assets/wireless.svg';

const nodes: MyNodeData[] = [
  {
    id: '3', text: '/stereo_camera_controller',
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
    id: '4', text: '/right/image_raw',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    },
  },
  {
    id: '5', text: '/image_adjuster_left_stereo',
    visible: true,
    type: NodeType.NODE,
    icon: {
      url: rosLogoURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '7', text: '/image_adjuster_right_stereo',
    visible: true,
    type: NodeType.NODE,
    icon: {
      url: rosLogoURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '8', text: '/disparity_node',
    visible: true,
    type: NodeType.NODE,
    icon: {
      url: rosLogoURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '9', text: '/point_cloud_node',
    visible: true,
    type: NodeType.NODE,
    icon: {
      url: rosLogoURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '10', text: '/left/image_raw/adjusted_stereo',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '11', text: '/right/image_raw/adjusted_stereo',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '12', text: '/disparity',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    }
  },
  {
    id: '13', text: '/points2',
    visible: true,
    type: NodeType.TOPIC,
    icon: {
      url: wirelessURL,
      height: 25,
      width: 25
    }
  },
]

const containerStyle = {
  margin: 8,
  display: "inline-block",
};

const NodeListWrapper = (props: any) => (
  <div style={containerStyle}>
    <MockPanelContextProvider>
      <NodeList 
        nodes={nodes}
        edges={[]}
      />
    </MockPanelContextProvider>
  </div>
);

storiesOf("panels/SystemView/NodeList", module)
  .add("Default", () => <NodeListWrapper />)
