// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

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

import { FlowElement, Elements, Position, XYPosition, ArrowHeadType } from "react-flow-renderer";

const position: XYPosition = { x: 0, y: 0 };

export const is_ros_node = (node: FlowElement): boolean => {
  return node.data.label.startsWith("T:") === false;
};

export const is_ros_topic = (node: FlowElement): boolean => {
  return node.data.label.startsWith("T:");
};

export const initialNodes: Elements = [
  // Nodes
  {
    id: "1",
    type: "input",
    isHidden: false,
    data: { label: "stereo_camera_controller" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: "2",
    type: "default",
    isHidden: false,
    data: { label: "image_adjuster_left_stereo" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: "3",
    type: "default",
    isHidden: false,
    data: { label: "image_adjuster_right_stereo" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: "4",
    type: "default",
    isHidden: false,
    data: { label: "disparity_node" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: "5",
    type: "default",
    isHidden: false,
    data: { label: "point_cloud_node" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: "6",
    type: "default",
    isHidden: true,
    data: { label: "_a_hidden_node" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },

  // Topics
  {
    id: "101",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/left/image_raw" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 100 },
  },
  {
    id: "102",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/right/image_raw" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 125, height: 40 },
  },
  {
    id: "103",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/left/image_raw/adjusted_stereo" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 125, height: 40 },
  },
  {
    id: "104",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/right/image_raw/adjusted_stereo" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 125, height: 40 },
  },

  {
    id: "105",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/disparity" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 125, height: 40 },
  },
  {
    id: "106",
    type: "default",
    isHidden: false,
    data: { label: "T: /viper/NavCamStereo/points2" },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 125, height: 40 },
  },
];

export const initialEdges: Elements = [
  {
    id: "edge-1-101",
    type: "default",
    isHidden: false,
    label: "10Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "1",
    target: "101",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-1-102",
    type: "default",
    isHidden: false,
    label: "10Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "1",
    target: "102",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },

  {
    id: "edge-101-2",
    type: "default",
    isHidden: false,
    label: "11Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "101",
    target: "2",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-102-3",
    type: "default",
    isHidden: false,
    label: "12Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "102",
    target: "3",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-2-103",
    type: "default",
    isHidden: false,
    label: "13Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "2",
    target: "103",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-3-104",
    type: "default",
    isHidden: false,
    label: "14Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "3",
    target: "104",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-103-4",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "103",
    target: "4",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-104-4",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "104",
    target: "4",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-4-105",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "4",
    target: "105",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-105-5",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "105",
    target: "5",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-5-106",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "5",
    target: "106",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "edge-103-5",
    type: "default",
    isHidden: false,
    label: "15Hz",
    labelStyle: { fill: "white" },
    labelBgStyle: { fill: "rgba(0,0,0,0)" },
    source: "103",
    target: "5",
    animated: true,
    arrowHeadType: ArrowHeadType.Arrow,
  },
];
