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

import { FlowElement, Edge, } from "react-flow-renderer";

export const isRosNode = (element: FlowElement): boolean => {
  return element.type === "rosNode";
};

export const isRosTopic = (element: FlowElement): boolean => {
  return element.type === "rosTopic";
};

export const isEdge = (element: FlowElement): boolean => {
  return element.hasOwnProperty("source");
};

export const getPeerNodeIds = (topic: FlowElement, elements: FlowElement[]): string[] => {
  const connected_edges: FlowElement[] = elements.filter((el): boolean => {
    return isEdge(el) && ((el as Edge).source === topic.id || (el as Edge).target === topic.id);
  });
  const connected_node_ids: string[] = connected_edges.map((edge): string => {
    if ((edge as Edge).source == topic.id) {
      return (edge as Edge).target;
    } else {
      return (edge as Edge).source;
    }
  });
  return connected_node_ids;
};
