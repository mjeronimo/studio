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

import {
  FlowElement,
  Elements,
  Edge,
  Position,
  XYPosition,
  ArrowHeadType,
} from "react-flow-renderer";

const position: XYPosition = { x: 0, y: 0 };

export const isRosNode = (node: FlowElement): boolean => {
  return node.type === "rosNode";
};

export const isRosTopic = (node: FlowElement): boolean => {
  return node.type === "rosTopic";
};

export const getPeerNodeIds = (node: FlowElement, edges: Edge[]): string[] => {
  const connected_edges = edges.filter((edge) => {
    return edge.source === node.id || edge.target === node.id;
  });

  return connected_edges.map((edge) => {
    return edge.source === node.id ? edge.target : edge.source;
  });
};

export const initialNodes: Elements = [
  // Nodes
  {
    id: "1",
    type: "rosNode",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "stereo_camera_controller",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },
  {
    id: "2",
    type: "rosNode",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "image_adjuster_left_stereo",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },
  {
    id: "3",
    type: "rosNode",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "image_adjuster_right_stereo",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },
  {
    id: "4",
    type: "rosNode",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "disparity_node",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },
  {
    id: "5",
    type: "rosNode",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "point_cloud_node",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },
  {
    id: "6",
    type: "rosNode",
    isHidden: true,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "_a_hidden_node",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 275, height: 79 },
  },

  // Topics
  {
    id: "101",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/left/image_raw",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 125, height: 40 },
  },
  {
    id: "102",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/right/image_raw",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 125, height: 40 },
  },
  {
    id: "103",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/image_raw/adjusted_stereo",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 125, height: 40 },
  },
  {
    id: "104",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/right/image_raw/adjusted_stereo",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 125, height: 40 },
  },

  {
    id: "105",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/disparity",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
    style: { width: 125, height: 40 },
  },
  {
    id: "106",
    type: "rosTopic",
    isHidden: false,
    data: {
      namespace: "/viper/NavCamStereo",
      label: "/points2",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    position,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
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
    arrowHeadType: ArrowHeadType.ArrowClosed,
  },
];
