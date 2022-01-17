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
import { memo, useState, useEffect } from 'react';
import ReactFlow, { Node, Edge, Elements, Background, OnLoadParams } from 'react-flow-renderer';
import { useStoreActions } from 'react-flow-renderer';

import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import { SystemViewToolbar } from "./SystemViewToolbar";
import { initialElements, getPeerNodeIds, isRosNode, isRosTopic, isEdge } from './initial-elements';
import { createGraphLayout } from "./layout";
import './layouting.css';

const nodeTypes = {
  rosNode: RosNode,
  rosTopic: RosTopic,
}

type Props = {
}

export const SystemViewer = memo((props: Props) => {
  const theme = useTheme();
  const [elements, setElements] = useState(initialElements);
  const [lrOrientation, setLROrientation] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [isConnectable, _setIsConnectable] = useState<boolean>(false);
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

  useEffect(() => {
    elements.forEach((el) => {
      if (isRosNode(el) || isRosTopic(el)) {
        el.data.hideNode = { hideNode }
      }
    });
  }, [elements]);

  const onLoad = (reactFlowInstance: OnLoadParams) => {
    setReactFlowInstance(reactFlowInstance);
    setInteractive(true);
    elements.forEach((el) => {
      if (isRosNode(el) || isRosTopic(el)) {
        el.data.hideNode = { hideNode }
      }
    });
    createGraphLayout(elements, lrOrientation, theme)
      .then(els => {
        setElements(els);
      })
      .catch(err => console.error(err))
  }

  const hideNode = (nodeId: string) => {
    setSelectedElements([]);
    const visibleNodes = elements.filter((node) => {
      return isRosNode(node) && (node.isHidden == false) && (node.id != nodeId);
    });
    const selectedNames: string[] = visibleNodes.map(node => { return node.data.label });
    selectionChange(selectedNames);
  }

  const selectionChange = (selectedNames: string[]) => {
    const ros_nodes = elements.filter(node => isRosNode(node));
    const ros_topics = elements.filter(node => isRosTopic(node));

    const newNodes = ros_nodes.map(node => {
      if (node.data && node.data.label && selectedNames.includes(node.data.label)) {
        return {
          ...node,
          isHidden: false,
        }
      }
      return {
        ...node,
        isHidden: true,
      }
    });

    const newTopics = ros_topics.map(node => {
      const peer_node_ids = getPeerNodeIds(node, elements);
      let shouldHide = true;
      peer_node_ids.forEach(peer_node_id => {
        const peer_node = newNodes.find((n) => n.id === peer_node_id);
        if (peer_node && !peer_node.isHidden) {
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
    const edges = elements.filter((el) => isEdge(el));
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

    const newElements = allNodes.concat(newEdges);
    setElements(newElements);
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

  const toggleOrientation = (lrOrientation: boolean) => {
    setLROrientation(lrOrientation);
    createGraphLayout(elements, lrOrientation, theme)
      .then(els => {
        setElements(els);

        // TODO: Decide whether to zoom and fit here
        //reactFlowInstance!.zoomTo(1.0);
        //reactFlowInstance!.fitView();
      })
      .catch(err => console.error(err))
  }

  const layoutGraph = (lrOrientation: boolean) => {
    createGraphLayout(elements, lrOrientation, theme)
      .then(els => {
        setElements(els);
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="layoutflow">
      <ReactFlow
        elements={elements}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultZoom={1.0}
        minZoom={0.2}
        maxZoom={4}
        onLoad={onLoad}
        nodesConnectable={isConnectable}
        nodeTypes={nodeTypes}
      >
        <Background
          color={theme.semanticColors.accentButtonBackground}
          gap={16}
        />
      </ReactFlow>
      <SystemViewToolbar
        elements={elements}
        lrOrientation={lrOrientation}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitview={fitView}
        onLayoutGraph={layoutGraph}
        onToggleOrientation={toggleOrientation}
        onSelectionChange={selectionChange}
      />
    </div>
  )
});
