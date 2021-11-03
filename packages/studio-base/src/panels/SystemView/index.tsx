import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";

import { Stack } from "@fluentui/react";

import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";

import * as PanelAPI from "@foxglove/studio-base/PanelAPI";
import Panel from "@foxglove/studio-base/components/Panel";
import Button from "@foxglove/studio-base/components/Button";
import Icon from "@foxglove/studio-base/components/Icon";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import TopicToRenderMenu from "@foxglove/studio-base/components/TopicToRenderMenu";
import { MessageEvent } from "@foxglove/studio-base/players/types";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

import filterMessages from "./filterMessages";
import helpContent from "./index.help.md";
import { RosgraphMsgs$Log } from "./types";
import FilterBar, { FilterBarProps } from "./FilterBar";
import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import LogList from "./LogList";
import LogMessage from "./LogMessage";
import NodePanel from "./NodePanel";

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
  removeElements,
} from 'react-flow-renderer';


import { ws_connect, ws_disconnect } from "./wsclient"

const nodeTypes = {
  rosNode: RosNode,
  rosTopic: RosTopic,
};

const hrStyles: CSSProperties = { height: '1px', background: '#aaa', border: 'none' };
const infoStyles: CSSProperties = { color: 'white', border: '0px solid #000', float: 'left', marginLeft: '0.5rem' };
const settingsStyles: CSSProperties = { background: '#0078d7', border: 'none', position: 'absolute', right: '0px' };
const magnifyStyles: CSSProperties = { border: '0px solid #000', float: 'right', marginRight: '0.5rem' };
const nodeTitleStyle: CSSProperties = { color: 'white', background: '#6263a4', textAlign: 'left', padding: '5px', paddingLeft: '5px', border: '0px solid #000' };
const noBorderStyle: CSSProperties = { border: '0px solid #000' };
const nodeBodyStyle: CSSProperties = { background: '#565899', height: '40px', border: 'none' };
const buttonWrapperStyles: CSSProperties = { background: '#cecece', border: '0px solid #000' };
const buttonStyle: CSSProperties = { position: 'absolute', left: 0, top: 35, zIndex: 4 };
const dismissStyle: CSSProperties = { color: 'white', position: 'absolute', top: '-13px', right: '-12px', border: '0px solid #000' };

const onLoad = (reactFlowInstance: OnLoadParams) => {
  ws_connect();
  console.log('flow loaded:', reactFlowInstance);
}
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

//////////////////////////

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
  const { minLogLevel, searchTerms } = config;

  const onFilterChange = useCallback<FilterBarProps["onFilterChange"]>(
    (filter) => {
      saveConfig({ ...config, minLogLevel: filter.minLogLevel, searchTerms: filter.searchTerms });
    },
    [config, saveConfig],
  );

  const { [config.topicToRender]: messages = [] } = PanelAPI.useMessagesByTopic({
    topics: [config.topicToRender],
    historySize: 100000,
  }) as { [key: string]: MessageEvent<RosgraphMsgs$Log>[] };

  // avoid making new sets for node names
  // the filter bar uess the node names during on-demand filtering
  const seenNodeNames = useRef(new Set<string>());
  messages.forEach((msg) => seenNodeNames.current.add(msg.message.name));

  const searchTermsSet = useMemo(() => new Set(searchTerms), [searchTerms]);

  const filteredMessages = useMemo(
    () => filterMessages(messages, { minLogLevel, searchTerms }),
    [messages, minLogLevel, searchTerms],
  );

  const topicToRenderMenu = (
    <TopicToRenderMenu
      topicToRender={config.topicToRender}
      onChange={(topicToRender) => saveConfig({ ...config, topicToRender })}
      topics={topics}
      allowedDatatypes={["rosgraph_msgs/Log", "rcl_interfaces/msg/Log"]}
      defaultTopicToRender={"/rosout"}
    />
  );

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

  const initialElements: Elements = [
    {
      id: '3',
      type: 'rosNode',
      data: { title: 'stereo_camera_controller' },
      style: { border: '0px', width: 215 },
      position: { x: 220, y: 50 },
    },
    {
      id: '2',
      type: 'rosTopic',
      data: { title: 'left/image_raw' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 100, y: 200 },
    },
    {
      id: '4',
      type: 'rosTopic',
      data: { title: 'right/image_raw' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 410, y: 200 },
    },
    {
      id: '5',
      type: 'rosNode',
      data: { title: 'image_adjuster_left_stereo' },
      style: { border: '0px', width: 225 },
      position: { x: 65, y: 350 },
    },
    {
      id: '7',
      type: 'rosNode',
      data: { title: 'image_adjuster_right_stereo' },
      style: { border: '0px', width: 225 },
      position: { x: 375, y: 350 },
    },
    {
      id: '8',
      type: 'rosNode',
      data: { title: 'disparity_node' },
      style: { border: '0px', width: 215 },
      position: { x: 225, y: 650 },
    },
    {
      id: '9',
      type: 'rosNode',
      data: { title: 'point_cloud_node' },
      style: { border: '0px', width: 215 },
      position: { x: 100, y: 925 },
    },
    {
      id: '10',
      type: 'rosTopic',
      data: { title: 'left/image_raw/adjusted_stereo' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 50, y: 500 },
    },
    {
      id: '11',
      type: 'rosTopic',
      data: { title: 'right/image_raw/adjusted_stereo' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 360, y: 500 },
    },
    {
      id: '12',
      type: 'rosTopic',
      data: { title: 'disparity' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 250, y: 780 },
    },
    {
      id: '13',
      type: 'rosTopic',
      data: { title: 'points2' },
      style: { textAlign: 'center', color: '#FFF', border: '0px solid #AAA', width: 215 },
      position: { x: 110, y: 1080 },
    },

    { id: 'e3-2', source: '3', target: '2', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '1Hz', style: { stroke: 'white' } },
    { id: 'e3-4', source: '3', target: '4', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e2-5', source: '2', target: '5', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white' }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },
    { id: 'e4-7', source: '4', target: '7', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white' }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },
    { id: 'e7-11', source: '7', target: '11', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e10-8', source: '10', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e5-10', source: '5', target: '10', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e11-8', source: '11', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e12-9', source: '12', target: '9', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
    { id: 'e10-9', source: '10', target: '9', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
    { id: 'e8-12', source: '8', target: '12', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
    { id: 'e9-13', source: '9', target: '13', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 } },
  ];

  //const [elements, setElements] = useState<Elements>([]);
  const [elements, setElements] = useState(initialElements);

  return (
    <Stack verticalFill>
      <PanelToolbar floating helpContent={helpContent} additionalIcons={topicToRenderMenu}>
        <FilterBar
          searchTerms={searchTermsSet}
          minLogLevel={minLogLevel}
          nodeNames={seenNodeNames.current}
          messages={filteredMessages}
          onFilterChange={onFilterChange}
        />
      </PanelToolbar>
      <Stack grow>
        <LogList
          items={filteredMessages}
          renderRow={({ item, style, key, index, ref }) => (
            <div ref={ref} key={key} style={index === 0 ? { ...style, paddingTop: 36 } : style}>
              <LogMessage msg={item.message} />
            </div>
          )}
        />
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
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
          <Button className={styles.iconButton} tooltip="Zoom fit" onClick={addRandomNode} style={buttonStyle}>
            <Icon style={{ color: "white" }} size="small" >
              <FitToPageIcon />
            </Icon>
          </Button>
        </ReactFlow>
        <NodePanel />
      </Stack>
    </Stack>
  );
});

SystemViewPanel.displayName = "SystemView";

export default Panel(
  Object.assign(SystemViewPanel, {
    defaultConfig: { searchTerms: [], minLogLevel: 1, topicToRender: "/rosout" } as Config,
    panelType: "RosOut",
  }),
);
