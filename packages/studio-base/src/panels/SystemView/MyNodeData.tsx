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

// import { result } from 'lodash';
import { NodeData, EdgeData } from 'reaflow';

export enum NodeType {
  NODE,
  TOPIC
};

export interface MyNodeData extends NodeData {
  type: NodeType
  visible: boolean
};

const rosLogoURL = 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg';
const wirelessURL = 'https://raw.githubusercontent.com/mjeronimo/studio/develop/packages/studio-base/src/panels/SystemView/assets/wireless.svg';

const initialNodes: MyNodeData[] = [
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

var initialEdges: EdgeData<any>[] = [
  { id: 'e3-4', from: '3', to: '4', text: '10 Hz' },
  { id: 'e3-2', from: '3', to: '2', text: '11 Hz' },
  { id: 'e4-7', from: '4', to: '7', text: '12 Hz' },
  { id: 'e2-5', from: '2', to: '5', text: '13 Hz' },
  { id: 'e7-11', from: '7', to: '11', text: '14 Hz' },
  { id: 'e10-8', from: '10', to: '8', text: '17 Hz' },
  { id: 'e10-9', from: '10', to: '9', text: '18 Hz' },
  { id: 'e5-10', from: '5', to: '10', text: '15 Hz' },
  { id: 'e11-8', from: '11', to: '8', text: '16 Hz' },
  { id: 'e12-9', from: '12', to: '9', text: '20 Hz' },
  { id: 'e8-12', from: '8', to: '12', text: '19 Hz' },
  { id: 'e9-13', from: '9', to: '13', text: '21 Hz' },
]

export function getInitialNodes(): MyNodeData[] { return initialNodes; }

export function getInitialEdges(): EdgeData<any>[] { return initialEdges; }
