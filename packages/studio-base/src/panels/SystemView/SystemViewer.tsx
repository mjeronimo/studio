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

import { useTheme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';
import ReactFlow, { Node, Edge, Background, OnLoadParams } from 'react-flow-renderer';
import { useStoreActions, useStoreState } from 'react-flow-renderer';

import { SystemViewToolbar } from "./SystemViewToolbar";
import { initialNodes, initialEdges } from './initial-elements';
import { createGraphLayout } from "./layout";
import './layouting.css';

type Props = {
}

export const SystemViewer = (props: Props) => {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [lrOrientation, setLROrientation] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();

  // const { zoomIn, zoomOut, fitView } = useZoomPanHelper();
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const isInteractive = useStoreState((s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable);
  //const isInteractive = false; 

  const theme = useTheme();

  useEffect(() => {
    createGraphLayout(nodes, edges, lrOrientation)
      .then(els => { setNodes(els); })
      .catch(err => console.error(err))
  //}, [nodes, edges, lrOrientation])
  }, [])

  const onLoad = async (_reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(_reactFlowInstance);
  }

  const selectionChange = async (selectedNames: string[]) => {
    const newNodes = nodes.map(node => {
      if (node.data && node.data.label && selectedNames.includes(node.data.label)) {
        return {
          ...node,
          isHidden: false
        }
      }
      return {
        ...node,
        isHidden: true
      }
    });

    const selectedNodes = newNodes.filter(node => { return !(node as Node).isHidden });
    const selectedIds = selectedNodes.map(node => { return node.id })

    const newEdges = edges.map(edge => {
      if (selectedIds.includes((edge as Edge<any>).source) && selectedIds.includes((edge as Edge<any>).target)) {
        return {
          ...edge,
          isHidden: false
        }
      }
      return {
        ...edge,
        isHidden: true
      }
    });

    createGraphLayout(newNodes, newEdges, lrOrientation)
      .then(els => { setNodes(els); setEdges(newEdges); })
      .catch(err => console.error(err))
  }

  const zoomIn = () => {
    reactFlowInstance?.zoomIn();
  }

  const zoomOut = () => {
    reactFlowInstance?.zoomOut();
  }

  const fitView = () => {
    reactFlowInstance?.fitView();
  }

  const interactiveChange = (isInteractive: boolean) => {
    setInteractive?.(isInteractive);
  }

  const toggleOrientation = async (lrOrientation: boolean) => {
    setLROrientation(lrOrientation);
    createGraphLayout(nodes, edges, lrOrientation)
      .then(els => { setNodes(els); reactFlowInstance!.zoomTo(1.0); reactFlowInstance!.fitView(); })
      .catch(err => console.error(err))
  }

  return (
    <div className="layoutflow">
      <ReactFlow
        elements={nodes.concat(edges)}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultZoom={1.0}
        minZoom={0.2}
        maxZoom={4}
        onLoad={onLoad}
      >
        <Background
          color={theme.semanticColors.accentButtonBackground}
          gap={16}
        />
      </ReactFlow>
      <SystemViewToolbar
        nodes={nodes}
        lrOrientation={lrOrientation}
        isInteractive={isInteractive}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitview={fitView}
        onInteractiveChange={interactiveChange}
        onToggleOrientation={toggleOrientation}
        onSelectionChange={selectionChange}
      />
    </div>
  )
};
