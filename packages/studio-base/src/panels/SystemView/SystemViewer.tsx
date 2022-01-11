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
import { useState, useEffect } from 'react';
import ReactFlow, { Node, Edge, Elements, Background, OnLoadParams } from 'react-flow-renderer';
import { useStoreActions } from 'react-flow-renderer';

import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import { SystemViewToolbar } from "./SystemViewToolbar";
import { initialNodes, initialEdges, getPeerNodeIds, isRosNode, isRosTopic } from './initial-elements';
import { createGraphLayout } from "./layout";
import './layouting.css';

const nodeTypes = {
  rosNode: RosNode,
  rosTopic: RosTopic,
}

type Props = {
}

const onSelectionChange = (elements: Elements | null) => {
  console.log('selection change', elements);
  elements && elements.forEach((element) => {
    console.log(element);
  });
}

export const SystemViewer = (props: Props) => {

  const theme = useTheme();
  const isInteractive = false;

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [lrOrientation, setLROrientation] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [isConnectable, _setIsConnectable] = useState<boolean>(false);

  const setInteractive = useStoreActions((actions) => actions.setInteractive);

  useEffect(() => {
    // TODO: Will this cause a render? Could do first render off-screen and update dimensions
    setNodes(nodes);

    createGraphLayout(nodes, edges, lrOrientation, theme)
      .then(els => { setNodes(els); setEdges(edges); })
      .catch(err => console.error(err))
  }, []);

  const onLoad = async (reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(reactFlowInstance);
    setInteractive(isInteractive);
  }

  const selectionChange = async (selectedNames: string[]) => {
    const ros_nodes = nodes.filter(node => isRosNode(node));
    const ros_topics = nodes.filter(node => isRosTopic(node));

    console.log("selectionChange");

    const newNodes = ros_nodes.map(node => {
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

    const newTopics = ros_topics.map(node => {
      const peer_node_ids = getPeerNodeIds(node, edges as Edge[]);
      let shouldHide = true;
      peer_node_ids.forEach(peer_node_id => {
        const peer_node = newNodes.find((n) => n.id === peer_node_id);
        if (!peer_node!.isHidden) {
          shouldHide = false;
        }
      })

      return {
        ...node,
        isHidden: shouldHide
      }
    });

    const allNodes = newNodes.concat(newTopics);
    const visibleNodes = allNodes.filter(node => { return (node as Node).isHidden === false });
    const visibleNodeIds = visibleNodes.map(node => { return node.id })

    console.log("edges", edges);

    const newEdges = edges.map(edge => {
      if (visibleNodeIds.includes((edge as Edge<any>).source) && visibleNodeIds.includes((edge as Edge<any>).target)) {
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

    console.log("newEdges", newEdges);

    setEdges(newEdges), 
    setNodes(allNodes); 
    //createGraphLayout(allNodes, newEdges, lrOrientation, theme)
    //  .then(els => { setEdges(newEdges), setNodes(els); })
    //  .catch(err => console.error(err))
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

  const interactiveChange = (newInteractive: boolean) => {
    setInteractive?.(newInteractive);
  }

  const toggleOrientation = async (lrOrientation: boolean) => {
    setLROrientation(lrOrientation);
    createGraphLayout(nodes, edges, lrOrientation, theme)
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
        nodesConnectable={isConnectable}
        nodeTypes={nodeTypes}
        onSelectionChange={onSelectionChange}
      >
        <Background
          color={theme.semanticColors.accentButtonBackground}
          gap={16}
        />
      </ReactFlow>
      <SystemViewToolbar
        nodes={nodes.filter(node => isRosNode(node))}
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
