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
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import TopicToRenderMenu from "@foxglove/studio-base/components/TopicToRenderMenu";
import { MessageEvent } from "@foxglove/studio-base/players/types";

import FilterBar, { FilterBarProps } from "./FilterBar";
import LogList from "./LogList";
import LogMessage from "./LogMessage";
import filterMessages from "./filterMessages";
import helpContent from "./index.help.md";
import { RosgraphMsgs$Log } from "./types";

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
} from 'react-flow-renderer';

const onLoad = (reactFlowInstance: OnLoadParams) => console.log('flow loaded:', reactFlowInstance);
const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const buttonStyle: CSSProperties = { position: 'absolute', left: 10, top: 70, zIndex: 4 };

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

  const [elements, setElements] = useState<Elements>([]);
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
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Lines} />

          <button type="button" onClick={addRandomNode} style={buttonStyle}>
            Add Node
          </button>
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
