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
import React, { useState, useCallback } from "react";

// FluentUI
import { Stack } from "@fluentui/react";

// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import sendNotification from "@foxglove/studio-base/util/sendNotification";
import { SaveConfig } from "@foxglove/studio-base/types/panels";

// Reaflow
import { Canvas, CanvasDirection, CanvasRef, Node, Edge, EdgeData, Icon, removeNode } from 'reaflow';

// react-zoom-pan-pinch
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// SystemView
import helpContent from "./index.help.md";
import { getInitialNodes, getInitialEdges, MyNodeData, NodeType } from "./MyNodeData";
import SystemViewToolbar from "./SystemViewToolbar";

const canvasRef = React.createRef<CanvasRef>();

type Props = {
  config: unknown;
  saveConfig: SaveConfig<unknown>;
};

const SystemViewPanel = React.memo(({}: Props) => {

  const initialNodes: MyNodeData[] = getInitialNodes();
  const _edges: EdgeData<any>[] = getInitialEdges();

  //const edges: EdgeData<any>[] = [
  const initialEdges: EdgeData<any>[] = [
    { id: 'e3-4', from: '3', to: '4', text: '10 Hz' },
    { id: 'e3-2', from: '3', to: '2', text: '11 Hz' },
    { id: 'e4-7', from: '4', to: '7', text: '12 Hz' },
    { id: 'e2-5', from: '2', to: '5', text: '13 Hz' },
    { id: 'e7-11', from: '7', to: '11', text: '14 Hz' },
    { id: 'e10-8', from: '10', to: '8', text: '17 Hz' },
    { id: 'e10-9', from: '10', to: '9', text: '18 Hz' },
    { id: 'e5-10', from: '5', to: '10', text: '15 Hz' },
    { id: 'e11-8', from: '11', to: '8', text: '16 Hz' },
    { id: 'e12-9', from: '12', to: '9', text: '20 Hz' },
    { id: 'e8-12', from: '8', to: '12', text: '19 Hz' },
    { id: 'e9-13', from: '9', to: '13', text: '21 Hz' },
  ]

  const [lrOrientation, setLROrientation] = useState<boolean>(true);
  const [direction, setDirection] = useState<CanvasDirection>('DOWN');
  const [selections, setSelections] = useState<string[]>([]);
  const [nodes, setNodes] = useState<MyNodeData[]>(initialNodes);
  const [edges, setEdges] = useState<EdgeData[]>(initialEdges);

  const myZoomIn = () => {
    const canvas = canvasRef.current!;
    if (canvas.zoomIn) {
      canvas.zoomIn();
    }
  }

  const myZoomOut = () => {
    const canvas = canvasRef.current!;
    if (canvas.zoomOut) {
      canvas.zoomOut();
    }
  }

  const toggleOrientation = useCallback(() => {
    setLROrientation(!lrOrientation);
    setDirection(lrOrientation ? 'RIGHT' : 'DOWN');
  }, [lrOrientation]);

  return (
    <Stack verticalFill>
      <PanelToolbar helpContent={helpContent} floating />
      <button
        style={{ position: 'absolute', top: 40, left: 10, zIndex: 999 }}
        onClick={() => sendNotification(
          "There are two nodes with the same name",
          "These are the details of the message",
          "user",
          "error",
        )}
      >
        Send Info
      </button>
      <button
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 999 }}
        onClick={() => setNodes([...nodes, {
          id: `a${Math.random()}`,
          visible: true,
          type: NodeType.NODE,
          text: `/node-${Math.random().toFixed(4)}`,
          icon: {
            url: 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg',
            height: 25,
            width: 25
          }
        }])}
      >
        Add Node
      </button>

      <Stack grow>
        <TransformWrapper
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
          doubleClick={{ step: 0.5 }}
          minScale={0.2}
          centerOnInit={true}
          centerZoomedOut={false}
          panning={{ velocityDisabled: true }}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView, ...rest }) => (
            <React.Fragment>
              <SystemViewToolbar
                nodes={nodes}
                edges={edges}
                lrOrientation={lrOrientation}
                zoomIn={myZoomIn}
                zoomOut={myZoomOut}
                toggleOrientation={toggleOrientation}
                fitToWindow={resetTransform}
              />
              <TransformComponent>
                <div>
                  <style>
                    {`
                      // Colors
                      $bg-color: hsl(256,33,10);
                      $dot-color: hsl(256,33,70);

                      // Dimensions
                      $dot-size: 1px;
                      $dot-space: 22px;

                      .foobar2 {
                          //background-color: grey;
                          // background-image: repeating-radial-gradient(red, yellow 10%, green 15%);
                          //background-image: repeating-radial-gradient(top center,rgba(255,255,255,.2),rgba(255,255,255,.2) 4px,transparent 0,transparent 100%);
                      }
                      .foobar {
                          background-color: #403366;
                          //background:
                            //linear-gradient(90deg, $bg-color ($dot-space - $dot-size), transparent 1%) center,
                            //linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center, $dot-color;
                          //background-size: $dot-space $dot-space;
                      }
                      .edge {
                        stroke: #b1b1b7;
                        stroke-dasharray: 5;
                        animation: dashdraw .5s linear infinite;
                        stroke-width: 1;
                      }
                      @keyframes dashdraw {
                        0% { stroke-dashoffset: 10; }
                        .dragger {
                          z-index: 999;
                          pointer-events: none;
                          user-select: none;
                          cursor: grabbing;
                          height: 70px;
                          width: 150px;
                        }
                      }
                    `}
                  </style>
                  <Canvas
                    className={"foobar"}
                    ref={canvasRef}
                    zoomable={false}
                    fit={false}
                    direction={direction}
                    center={false}
                    maxWidth={5000}
                    maxHeight={5000}
                    nodes={nodes}
                    edges={edges}
                    selections={selections}
                    node={
                      <Node
                        style={{
                          boxShadow: "10px 10px 8px #ff0000",
                        }}
                        icon={<Icon />}
                        linkable={false}
                        onClick={(event, node) => {
                          setSelections([node.id]);
                        }}
                        onRemove={(event, node) => {
                          (node as MyNodeData).visible = false;
                          setSelections([]);

                          const visibleNodes: MyNodeData[] = [];
                          nodes.forEach(function (node): void {
                          if (node.visible) {
                              visibleNodes.push(node);
                            }
                          });

                          const result = removeNode(nodes, edges, node.id);

                          setNodes(result.nodes);
                          setEdges(result.edges);
                        }}
                      />
                    }
                    edge={<Edge className="edge" />}
                    onCanvasClick={(event) => {
                      setSelections([]);
                    }}
                    onLayoutChange={layout => console.log('Layout', layout)} >
                  </Canvas>
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </Stack>
    </Stack>
  );
});

SystemViewPanel.displayName = "SystemView";

export default Panel(
  Object.assign(SystemViewPanel, {
    defaultConfig: {},
    panelType: "SystemView",
  }),
);
