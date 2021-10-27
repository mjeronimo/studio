// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { Stack } from "@fluentui/react";
import { useCallback, useMemo, useRef } from "react";

import * as PanelAPI from "@foxglove/studio-base/PanelAPI";
import Panel from "@foxglove/studio-base/components/Panel";
import Button from "@foxglove/studio-base/components/Button";
import Icon from "@foxglove/studio-base/components/Icon";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import TopicToRenderMenu from "@foxglove/studio-base/components/TopicToRenderMenu";
import { MessageEvent } from "@foxglove/studio-base/players/types";

import FilterBar, { FilterBarProps } from "./FilterBar";
import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import LogList from "./LogList";
import LogMessage from "./LogMessage";
import filterMessages from "./filterMessages";
import helpContent from "./index.help.md";
import { RosgraphMsgs$Log } from "./types";

import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";

import { Icon as FluentIcon } from "@fluentui/react";
import { Dismiss12Regular, Info24Regular, Settings24Filled } from "@fluentui/react-icons";

import PiIcon from './Raspberry_Pi-Logo.wine.svg';
import InfoIcon from './info.svg';
import SettingsIcon from './settings.svg';
import MagnifyIcon from './magnify.svg';

//////

import { useState, MouseEvent, CSSProperties } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
  Elements,
  ElementId,
  Node,
  FlowElement,
  BackgroundVariant,
  Connection,
  Edge,
  ArrowHeadType
} from 'react-flow-renderer';

const nodeTypes = {
  rosNode: RosNode,
  rosTopic: RosTopic,
};

const hrStyles: CSSProperties = { height: '1px', background: '#aaa', border: 'none' };

const infoStyles: CSSProperties = { color: 'white', border: '0px solid #000', float: 'left', marginLeft: '0.5rem' };

//const settingsStyles: CSSProperties = { color: 'white', border: '0px solid #000', float: 'right', marginRight: '0.5rem', background: '#0078d7' };
const settingsStyles: CSSProperties =   { background: '#0078d7', border: 'none', position: 'absolute', right: '0px' };

const magnifyStyles: CSSProperties = { border: '0px solid #000', float: 'right', marginRight: '0.5rem' };

const nodeTitleStyle: CSSProperties = { color: 'white', background: '#6263a4', textAlign: 'left', padding: '5px', paddingLeft: '5px', border: '0px solid #000' };

const dismissStyle: CSSProperties = {
  color: 'white',
  position: 'absolute',
  top: '-13px',
  right: '-12px',
  border: '0px solid #000'
};
const noBorderStyle: CSSProperties = { border: '0px solid #000' };
const nodeBodyStyle: CSSProperties = { background: '#565899', height: '40px', border: 'none' };

const buttonWrapperStyles: CSSProperties = { background: '#cecece', border: '0px solid #000' };
const onLoad = (reactFlowInstance: OnLoadParams) => console.log('flow loaded:', reactFlowInstance);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const buttonStyle: CSSProperties = { position: 'absolute', left: 0, top: 35, zIndex: 4 };


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
      data: { label: `Node: ${nodeId}` },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    };
    setElements((els) => els.concat(newNode));
  };

const onChange = () => {}

const initialElements: Elements = [
  {
    id: '3',
    data: {
      label: (
        <>
          <div style={nodeTitleStyle} >
            <Icon style={{ color: "white" }} size="medium" >
              <PiIcon />
            </Icon>
            <strong>stereo_camera_controller</strong>
            <Button className={styles.iconButton} tooltip="Remove node from graph" onClick={addRandomNode}>
              <Dismiss12Regular style={dismissStyle} />
            </Button>
          </div>
          <div style={nodeBodyStyle}>
            <Button className={styles.iconButton} tooltip="Display node parameters" onClick={addRandomNode} style={settingsStyles} >
              <Settings24Filled />
            </Button>
          </div>
        </>
      ),
    },
    position: { x: 220, y: 50 },
    style: { background: '#cccccc', border: '0px solid #fff', margin: 0, padding: 0, width: 215, borderRadius: "0px" },
  },
  {
    id: '2',
    type: 'rosTopic',
    data: { title: 'left/image_raw', onChange: onChange },
    style: { background: 'red', color: '#333', border: '0px solid #AAA', width: 100 },
    position: { x: 100, y: 200 },
  },
  {
    id: '4',
    type: 'rosTopic',
    data: { title: 'right/image_raw', onChange: onChange },
    style: { background: 'red', color: '#333', border: '0px solid #AAA', width: 100 },
    position: { x: 410, y: 200 },
  },
  {
    id: '5',
    type: 'rosNode',
    data: { title: 'image_adjuster_left_stereo', onChange: onChange },
    //style: { background: 'blue', color: '#333', border: '0px solid #ffc', width: 180 },
    style: { border: '0px', width: 180 },
    position: { x: 65, y: 350 },
  },
  {
    id: '7',
    data: {
      label: (
        <>
          <strong>image_adjuster_right_stereo</strong>
          <hr style={hrStyles}/>
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./settings.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    position: { x: 375, y: 350 },
    style: { background: '#FAEDCD', color: '#333', border: '1px solid #ffc', width: 180, borderRadius: "50px" },
  },
  {
    id: '8',
    data: {
      label: (
        <>
          <strong>disparity_node</strong>
          <hr style={hrStyles}/>
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./settings.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    position: { x: 225, y: 650 },
    style: { background: '#FAEDCD', color: '#333', border: '1px solid #ffc', width: 170, borderRadius: "50px" },
  },
  {
    id: '9',
    data: {
      label: (
        <>
          <strong>point_cloud_node</strong>
          <hr style={hrStyles}/>
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./settings.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    position: { x: 100, y: 925 },
    style: { background: '#FAEDCD', color: '#333', border: '1px solid #ffc', width: 170, borderRadius: "50px" },
  },
  {
    id: '10',
    position: { x: 50, y: 500 },
    data: {
      label: (
        <>
          <strong>left/image_raw/adjusted_stereo</strong>
          <hr style={hrStyles} />
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./magnify.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    style: { background: '#FFFFFF', color: '#333', border: '1px solid #AAA', width: 200 },
  },
  {
    id: '11',
    position: { x: 360, y: 500 },
    data: {
      label: (
        <>
          <strong>right/image_raw/adjusted_stereo</strong>
          <hr style={hrStyles} />
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./magnify.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    //style: { background: '#FFFFFF', color: '#333', backgroundColor: 'rgba(52, 52, 52, 0.8)', border: '1px solid #AAA', width: 180 },
    style: { background: '#FFFFFF', color: '#333', border: '1px solid #AAA', width: 200 },
  },
  {
    id: '12',
    position: { x: 250, y: 780 },
    data: {
      label: (
        <>
          <strong>disparity</strong>
          <hr style={hrStyles} />
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./magnify.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    style: { background: '#FFFFFF', color: '#333', border: '1px solid #AAA', width: 120 },
  },
  {
    id: '13',
    position: { x: 110, y: 1080 },
    data: {
      label: (
        <>
          <strong>points2</strong>
          <hr style={hrStyles} />
          <div style={buttonWrapperStyles}>
            <img src="./info.svg" style={infoStyles} width="7" height="20" />
            <img src="./magnify.svg" style={settingsStyles} width="20" height="20" />
          </div>
        </>
      ),
    },
    style: { background: '#FFFFFF', color: '#333', border: '1px solid #AAA', width: 150 },
  },

  { id: 'e3-2', source: '3', target: '2', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
  { id: 'e3-4', source: '3', target: '4', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },

  { id: 'e2-5', source: '2', target: '5', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white'  }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },

  { id: 'e4-7', source: '4', target: '7', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '10 Hz', style: { stroke: 'white'  }, labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.0 } },

  { id: 'e7-11', source: '7', target: '11', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' } },
  { id: 'e10-8', source: '10', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' }  },
  { id: 'e5-10', source: '5', target: '10', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' }  },
  { id: 'e11-8', source: '11', target: '8', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' }  },
  { id: 'e12-9', source: '12', target: '9', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 }  },
  { id: 'e10-9', source: '10', target: '9', arrowHeadType: ArrowHeadType.Arrow, animated: true, label: '', style: { stroke: 'white' }  },
  { id: 'e8-12', source: '8', target: '12', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 }  },
  { id: 'e9-13', source: '9', target: '13', animated: false, label: '', style: { stroke: 'red', strokeWidth: 3 }  },
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
