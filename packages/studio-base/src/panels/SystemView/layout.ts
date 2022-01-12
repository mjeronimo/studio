// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import type { Theme } from "@fluentui/theme";
import calculateSize from "calculate-size";
import ELK, { ElkNode, ElkPrimitiveEdge } from "elkjs/lib/elk.bundled";
import { isNode, Position, Node, Edge, NodeProps, Elements } from "react-flow-renderer";

import RosNode from "./RosNode";
import { isRosTopic } from "./initial-elements";
import React from "react";
import ReactDOM from 'react-dom';

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 50;

const elk = new ELK({
  defaultLayoutOptions: {
    "elk.nodeLabels.placement": "INSIDE V_CENTER H_RIGHT",
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "org.eclipse.elk.layered.layering.strategy": "INTERACTIVE",
    "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
    "elk.layered.unnecessaryBendpoints": "true",
    "elk.layered.spacing.edgeNodeBetweenLayers": "50",
    "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    "org.eclipse.elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "org.eclipse.elk.insideSelfLoops.activate": "true",
    separateConnectedComponents: "true",
    "spacing.componentComponent": "70",
    spacing: "75",
    "spacing.nodeNodeBetweenLayers": "125",
    "elk.spacing.nodeNode": "75",
    "elk.zoomToFit": "true",
  },
});

export function measureText(text: string, theme: Theme) {
  let result = { height: 0, width: 0 };
  if (text) {
    result = calculateSize(text, {
      font: theme.fonts.medium.fontFamily,
      fontSize: theme.fonts.medium.fontSize as string,
      fontWeight: theme.fonts.medium.fontWeight as string,
    });
  }
  return result;
}

export const createGraphLayout = async (
  nodes: Elements,
  edges: Elements,
  lrOrientation: boolean,
  theme: Theme,
): Promise<Elements> => {
  const direction = lrOrientation ? "RIGHT" : "DOWN";
  const elk_nodes: ElkNode[] = [];

  nodes.forEach((el) => {
    if (!el.isHidden) {
      if (isRosTopic(el)) {
        // Resize and reposition the topics based on the topic name
        const topic = el as Node;
        const result = measureText(el.data.label, theme);

        topic.style!.width = result.width;
        topic.style!.height = result.height;

        elk_nodes.push({
          id: el.id,
          //width: result.width,
          //height: result.height,
          width: DEFAULT_WIDTH, // TODO: would like to layout using the actual dimensions
          height: DEFAULT_HEIGHT,
        });
      } else {
        elk_nodes.push({
          id: el.id,
          width: DEFAULT_WIDTH, // TODO: would like to layout using the actual dimensions
          height: DEFAULT_HEIGHT,
        });
      }
    }
  });

  const elk_edges: ElkPrimitiveEdge[] = [];
  edges.forEach((el) => {
    if (!el.isHidden) {
      const edge: Edge = el as Edge;
      elk_edges.push({
        id: edge.id,
        target: edge.target,
        source: edge.source,
      });
    }
  });

  const isHorizontal = direction === "RIGHT";
  const newGraph = await elk.layout({
    id: "root",
    children: elk_nodes,
    edges: elk_edges,
    layoutOptions: {
      "elk.direction": direction,
      "elk.spacing.nodeNode": isHorizontal ? "275" : "275",
      "spacing.nodeNodeBetweenLayers": isHorizontal ? "200" : "150",
      "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
      "org.eclipse.elk.edgeRouting": "POLYLINE",
    },
  });

  return nodes.map((el) => {
    const temp = Object.assign({}, el) as Node;
    if (isNode(el)) {
      const node = newGraph?.children?.find((n) => n.id === el.id);

      // The layout was done with a single standard size in order to get the nodes
      // to align properly. Adjust the position now based on the actual size.
      if (node?.x && node?.y && node?.width && node?.height) {
        temp.position = {
          x: node.x - ((el.style!.width! as number) - DEFAULT_WIDTH) / 2 + Math.random() / 1000,
          y: node.y - ((el.style!.height! as number) - DEFAULT_HEIGHT) / 2,
        };
      }

      // Initialize the location of the connection points (top/bottom or left/right)
      temp.targetPosition = isHorizontal ? Position.Left : Position.Top;
      temp.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // Resize and reposition the topics based on the topic name
      //if (isRosTopic(el)) {
      if (false) {
        const result = measureText(el.data.label, theme);
        const current = el.style!.width as number;
        const actual = result.width;
        const half_diff = (actual - current) / 2;

        console.log("1: temp.style.height: ", temp.style!.height);

        temp.style!.width = result.width;
        temp.style!.height = result.height;
        temp.position.x = temp.position.x - half_diff;

        //console.log("temp.style.width: ", temp.style!.width);
        console.log("2: temp.style.height: ", temp.style!.height);
        //console.log("temp.position.x: ", temp.position.x);
      }
    }
    return temp;
  });
};
