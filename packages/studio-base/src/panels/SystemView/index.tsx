// React 
import { MouseEvent, useState, useCallback } from "react";

// FluentUI
import { Stack } from "@fluentui/react";

// Foxglove
import * as PanelAPI from "@foxglove/studio-base/PanelAPI";
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Button from "@foxglove/studio-base/components/Button";

import dagre from 'dagre';

// ReactFlow
import ReactFlow, {
  addEdge,
  ArrowHeadType,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ElementId,
  Elements,
  FlowElement,
  Node,
  OnLoadParams,
  Position,
  isNode,
  removeElements,
} from 'react-flow-renderer';

// Local
import helpContent from "./index.help.md";
import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import NodePanel from "./NodePanel";
import { ws_connect, ws_disconnect } from "./WebSocketClient"

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 100;

const getLayoutedElements = (elements: Elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      // el.targetPosition = isHorizontal ? 'left' : 'top';
      // el.sourcePosition = isHorizontal ? 'right' : 'bottom';
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

const nodeTypes = {
  rosNode: RosNode,
  rosTopic: RosTopic,
};

const onLoad = (reactFlowInstance: OnLoadParams) => {
  ws_connect();
  console.log('flow loaded:', reactFlowInstance);
}
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

// TODO: Define the default configuration for this panel
type Config = {
  searchTerms: string[];
  minLogLevel: number;
  topicToRender: string;
};

type Props = {
  config: Config;
  saveConfig: (arg0: Config) => void;
};

const SystemViewPanel = React.memo(({ config, saveConfig }: Props) => {
  const { topics } = PanelAPI.useDataSourceInfo();

  // TODO: configuration
  const { minLogLevel, searchTerms } = config;

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  const addRandomNode = () => {
    const nodeId: ElementId = (elements.length + 1).toString();
    const newNode: Node = {
      id: nodeId,
      type: 'rosNode',
      data: { title: `Node: ${nodeId}` },
      style: { border: '0px', width: 180 },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setElements((els) => els.concat(newNode));
  };

  const onChange = () => { }
  const edgeType = 'smoothstep';

  const initialElements: Elements = [
    {
      id: '3',
      type: 'rosNode',
      data: { title: 'stereo_camera_controller' },
      style: { border: '0px', width: 250 },
      position: { x: 220, y: 50 },
    },
    {
      id: '2',
      type: 'rosTopic',
      data: { title: 'left/image_raw' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 100, y: 200 },
    },
    {
      id: '4',
      type: 'rosTopic',
      data: { title: 'right/image_raw' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 410, y: 200 },
    },
    {
      id: '5',
      type: 'rosNode',
      data: { title: 'image_adjuster_left_stereo' },
      style: { border: '0px', width: 250 },
      position: { x: 65, y: 350 },
    },
    {
      id: '7',
      type: 'rosNode',
      data: { title: 'image_adjuster_right_stereo' },
      style: { border: '0px', width: 250 },
      position: { x: 375, y: 350 },
    },
    {
      id: '8',
      type: 'rosNode',
      data: { title: 'disparity_node' },
      style: { border: '0px', width: 250 },
      position: { x: 225, y: 650 },
    },
    {
      id: '9',
      type: 'rosNode',
      data: { title: 'point_cloud_node' },
      style: { border: '0px', width: 250 },
      position: { x: 100, y: 925 },
      isHidden: false
    },
    {
      id: '10',
      type: 'rosTopic',
      data: { title: 'left/image_raw/adjusted_stereo' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 50, y: 500 },
    },
    {
      id: '11',
      type: 'rosTopic',
      data: { title: 'right/image_raw/adjusted_stereo' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 360, y: 500 },
    },
    {
      id: '12',
      type: 'rosTopic',
      data: { title: 'disparity' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 250, y: 780 },
    },
    {
      id: '13',
      type: 'rosTopic',
      data: { title: 'points2' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 250 },
      position: { x: 110, y: 1080 },
    },


    { id: 'e3-2', type: edgeType, source: '3', target: '2', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '1Hz', style: { stroke: 'white' } },
    { id: 'e3-4', type: edgeType, source: '3', target: '4', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e2-5', type: edgeType, source: '2', target: '5', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white' }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },
    { id: 'e4-7', type: edgeType, source: '4', target: '7', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white' }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },
    { id: 'e7-11', type: edgeType, source: '7', target: '11', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e10-8', type: edgeType, source: '10', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e5-10', type: edgeType, source: '5', target: '10', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e11-8', type: edgeType, source: '11', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e12-9', type: edgeType, source: '12', target: '9', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
    { id: 'e10-9', type: edgeType, source: '10', target: '9', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e8-12', type: edgeType, source: '8', target: '12', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
    { id: 'e9-13', type: edgeType, source: '9', target: '13', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
  ];

  //const [elements, setElements] = useState<Elements>([]);
  const [elements, setElements] = useState(getLayoutedElements(initialElements));

  const onLayout = useCallback(
    (direction: string) => {
      const layoutedElements = getLayoutedElements(elements, direction);
      setElements(layoutedElements);
    },
    [elements]
  );

  return (
    <Stack verticalFill>
      <PanelToolbar helpContent={helpContent} floating />
      <Stack grow>
        <ReactFlow
          elements={elements}
          onLoad={onLoad}
          onElementClick={onElementClick}
          onElementsRemove={onElementsRemove}
          onConnect={(p) => onConnect(p)}
          onNodeDragStop={onNodeDragStop}
          onlyRenderVisibleElements={false}
          nodeTypes={nodeTypes}
        >
          <Controls>
            <Button onClick={() => onLayout('TB')}>vertical layout</Button>
            <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
          </Controls>
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
        <NodePanel />
      </Stack>
    </Stack>
  );
});

SystemViewPanel.displayName = "SystemView";

export default Panel(
  Object.assign(SystemViewPanel, {
    // TODO: configuration
    defaultConfig: { searchTerms: [], minLogLevel: 1, topicToRender: "/rosout" } as Config,
    panelType: "SystemView",
  }),
);
