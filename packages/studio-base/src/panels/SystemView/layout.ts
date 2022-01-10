// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import type { Theme } from '@fluentui/theme';
import ELK, { ElkNode, ElkPrimitiveEdge } from "elkjs/lib/elk.bundled";
import { isNode, Position, Node, Edge, Elements } from "react-flow-renderer";
import calculateSize from 'calculate-size';
import { is_ros_topic } from "./initial-elements";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 50;

const elk = new ELK({
  //  defaultLayoutOptions: {
  //    'elk.algorithm': 'org.eclipse.elk.layered',
  //    'elk.direction': 'RIGHT',
  //    'elk.spacing.nodeNode': '75',
  //    'elk.layered.spacing.nodeNodeBetweenLayers': '75',
  //  }

  /**
   * ELK layout options applied by default, unless overridden through <Canvas layoutOptions> property.
   *
   * XXX Not to be confounded with ELK "defaultLayoutOptions" property, which is meant to be used as fallback, when no layout option is provided.
   *
   * @see https://www.eclipse.org/elk/reference/options.html
   */
  //defaultLayoutOptions: ElkCanvasLayoutOptions = {
  defaultLayoutOptions: {
    /**
     * Hints for where node labels are to be placed; if empty, the node label’s position is not modified.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-nodeLabels-placement.html
     */
    "elk.nodeLabels.placement": "INSIDE V_CENTER H_RIGHT",

    /**
     * Select a specific layout algorithm.
     *
     * Uses "layered" strategy.
     * It emphasizes the direction of edges by pointing as many edges as possible into the same direction.
     * The nodes are arranged in layers, which are sometimes called “hierarchies”,
     * and then reordered such that the number of edge crossings is minimized.
     * Afterwards, concrete coordinates are computed for the nodes and edge bend points.
     *
     * @see https://www.eclipse.org/elk/reference/algorithms.html
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-algorithm.html
     * @see https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
     */
    //'elk.algorithm': 'org.eclipse.elk.layered',
    "elk.algorithm": "layered",

    /**
     * Overall direction of edges: horizontal (right / left) or vertical (down / up).
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-direction.html
     */
    "elk.direction": "DOWN",

    /**
     * Strategy for node layering.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-layering-strategy.html
     */
    "org.eclipse.elk.layered.layering.strategy": "INTERACTIVE",

    /**
     * What kind of edge routing style should be applied for the content of a parent node.
     * Algorithms may also set this option to single edges in order to mark them as splines.
     * The bend point list of edges with this option set to SPLINES
     * must be interpreted as control points for a piecewise cubic spline.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-edgeRouting.html
     */
    "org.eclipse.elk.edgeRouting": "ORTHOGONAL",

    /**
     * Adds bend points even if an edge does not change direction.
     * If true, each long edge dummy will contribute a bend point to its edges
     * and hierarchy-crossing edges will always get a bend point where they cross hierarchy boundaries.
     * By default, bend points are only added where an edge changes direction.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-unnecessaryBendpoints.html
     */
    "elk.layered.unnecessaryBendpoints": "true",

    /**
     * The spacing to be preserved between nodes and edges that are routed next to the node’s layer.
     * For the spacing between nodes and edges that cross the node’s layer ‘spacing.edgeNode’ is used.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-spacing-edgeNodeBetweenLayers.html
     */
    "elk.layered.spacing.edgeNodeBetweenLayers": "50",

    /**
     * Tells the BK node placer to use a certain alignment (out of its four)
     * instead of the one producing the smallest height, or the combination of all four.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-nodePlacement-bk-fixedAlignment.html
     */
    "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",

    /**
     * Strategy for cycle breaking.
     *
     * Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles.
     * Reversed edges will end up pointing to the opposite direction of regular edges
     * (that is, reversed edges will point left if edges usually point right).
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-cycleBreaking-strategy.html
     */
    "org.eclipse.elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",

    /**
     * Whether this node allows to route self loops inside of it instead of around it.
     *
     * If set to true, this will make the node a compound node if it isn’t already,
     * and will require the layout algorithm to support compound nodes with hierarchical ports.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-insideSelfLoops-activate.html
     */
    "org.eclipse.elk.insideSelfLoops.activate": "true",

    /**
     * Whether each connected component should be processed separately.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-separateConnectedComponents.html
     */
    separateConnectedComponents: "true",

    /**
     * Spacing to be preserved between pairs of connected components.
     * This option is only relevant if ‘separateConnectedComponents’ is activated.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-spacing-componentComponent.html
     */
    "spacing.componentComponent": "70",

    /**
     * TODO: Should be spacing.baseValue?
     * An optional base value for all other layout options of the ‘spacing’ group.
     * It can be used to conveniently alter the overall ‘spaciousness’ of the drawing.
     * Whenever an explicit value is set for the other layout options, this base value will have no effect.
     * The base value is not inherited, i.e. it must be set for each hierarchical node.
     *
     * @see https://www.eclipse.org/elk/reference/groups/org-eclipse-elk-layered-spacing.html
     */
    spacing: "75",

    /**
     * The spacing to be preserved between any pair of nodes of two adjacent layers.
     * Note that ‘spacing.nodeNode’ is used for the spacing between nodes within the layer itself.
     *
     * @see https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-spacing-nodeNodeBetweenLayers.html
     */
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
      elk_nodes.push({
        id: el.id,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        //width: +el.style!.width!,
        //height: +el.style!.height!,
      });
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
      "elk.spacing.nodeNode": isHorizontal ? "150" : "150",
      "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
      //'elk.layered.layering.strategy': 'LONGEST_PATH',
      //'elk.layered.layering.strategy': 'COFFMAN_GRAPH',
      //'elk.layered.layering.strategy': 'INTERACTIVE',
      //'elk.layered.layering.strategy': 'STRETCH_WIDTH',
      //'elk.layered.layering.strategy': 'MIN_WIDTH',

      "org.eclipse.elk.edgeRouting": "POLYLINE",

      //'org.eclipse.elk.alignment': 'CENTER',
      //'org.eclipse.elk.contentAlignment': 'V_CENTER',
      //'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': "BALANCED",
      //'org.eclipse.elk.layered.layering.layerConstraint': 'LAST',
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
      // TODO: Resolve this duplication:
      temp.targetPosition = isHorizontal ? Position.Left : Position.Top;
      temp.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      temp.data.targetPosition = isHorizontal ? Position.Left : Position.Top;
      temp.data.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // Resize and reposition the topics based on the topic name
      if (is_ros_topic(el)) {
        const result = measureText(el.data.label, theme);
        const current = el.style!.width as number;
        const actual = result.width;
        const half_diff = (actual - current) / 2;

        temp.style!.width = result.width;
        temp.style!.height = result.height;
        temp.position.x = temp.position.x - half_diff;
      }
    }
    return temp;
  });
};
