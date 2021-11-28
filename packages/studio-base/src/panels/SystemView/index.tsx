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

// React
import React, { useState, useEffect, useCallback } from 'react';

// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import { SaveConfig } from "@foxglove/studio-base/types/panels";

// ReactFlow
import ReactFlow, { ReactFlowProvider, Elements, Background } from 'react-flow-renderer';

// SystemView
import { initialNodes, initialEdges } from './initial-elements';
import { createGraphLayout } from "./layout";
import { SystemViewToolbar } from "./SystemViewToolbar";
import './layouting.css';

type Props = {
  config: unknown;
  saveConfig: SaveConfig<unknown>;
}

const SystemViewPanel = (props: Props) => {

  const { config, saveConfig } = props
  const [elements, setElements] = useState<Elements>(initialNodes)
  const [edges, setEdges] = useState<Elements>(initialEdges)

  useEffect(() => {
    createGraphLayout(elements.concat(edges))
      .then(els => {
        setElements(els)
      })
      .catch(err => console.error(err))
  }, [])

  const onLayout = useCallback(
    (direction: any) => {
      createGraphLayout(elements.concat(edges), direction)
        .then(els => setElements(els))
        .catch(err => console.error(err))
    },
    [elements]
  );

  const toggleOrientation = useCallback((lrOrientation: boolean) => {
    onLayout(lrOrientation ? 'RIGHT' : 'DOWN');
  }, []);

  return (
    <>{!elements ? (
      <p>Loading ...</p>
    ) : (
      <div className="layoutflow">
        <ReactFlowProvider>
          <ReactFlow
            elements={elements.concat(edges)}
            snapToGrid={true}
            snapGrid={[15, 15]}
            //{...otherProps}
          >
            <Background color="#aaa" gap={16} />
          </ReactFlow>
          <SystemViewToolbar
            nodes={elements}
            edges={edges}
            setElements={setElements}
            lrOrientation={true}
            onToggleOrientation={toggleOrientation}
            onLayout={onLayout}
          />
        </ReactFlowProvider>
      </div>
    )
    }</>
  )
};

SystemViewPanel.displayName = "SystemView";
SystemViewPanel.panelType = "SystemView";
SystemViewPanel.defaultConfig = {};
SystemViewPanel.supportsStrictMode = false;

export default Panel(SystemViewPanel);