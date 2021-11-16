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
import { useState, useCallback, useEffect } from "react";

// FluentUI
import { Stack, Link, MessageBar, MessageBarType, MessageBarButton, mergeStyleSets } from "@fluentui/react";
import { PaneOpen24Regular } from "@fluentui/react-icons";
import { useBoolean } from '@fluentui/react-hooks';

import CursorDefault from "@mdi/svg/svg/cursor-default.svg";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";
import Checkbox from "@foxglove/studio-base/components/Checkbox";

import ExpandingToolbar, {
  ToolGroup,
  ToolGroupFixedSizePane,
} from "@foxglove/studio-base/components/ExpandingToolbar";


// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Button from "@foxglove/studio-base/components/Button";
import { colors } from "@foxglove/studio-base/util/sharedStyleConstants";
import FoxgloveIcon from "@foxglove/studio-base/components/Icon";
import Flex from "@foxglove/studio-base/components/Flex";

// Reaflow
import { Canvas, CanvasDirection, CanvasRef, Node, NodeData, Edge, EdgeData, Icon, removeNode } from 'reaflow';

// react-zoom-pan-pinch
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// MDI icons
import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";
import ArrowLeftRightIcon from "@mdi/svg/svg/arrow-left-right.svg";
import ArrowUpDownIcon from "@mdi/svg/svg/arrow-up-down.svg";
import Plus from "@mdi/svg/svg/plus.svg";
import Minus from "@mdi/svg/svg/minus.svg";

// SystemView
import helpContent from "./index.help.md";
import NodePanel from "./NodePanel";
import Toolbar from "./Toolbar";
import { MyNodeData } from "./MyNodeData";

import { Portal } from 'rdk';
import SendNotificationToastAdapter from "@foxglove/studio-base/components/SendNotificationToastAdapter";
import StudioToastProvider from "@foxglove/studio-base/components/StudioToastProvider";
import sendNotification from "@foxglove/studio-base/util/sendNotification";


const canvasRef = React.createRef<CanvasRef>();

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

const styles2 = mergeStyleSets({
  iconButton: {
    backgroundColor: "transparent !important",
    border: "none !important",
    padding: "8px 4px !important",
    alignItems: "start !important",
    marginRight: "4px !important",
    marginLeft: "4px !important",
  },
  buttons: {
    backgroundColor: `${colors.DARK3}`,
    borderRadius: "4px",
    boxShadow: "0 0px 32px rgba(8, 8, 10, 0.6)",
    overflow: "hidden",
    pointerEvents: "auto",
    flexShrink: "0",

    display: "flex",
    flexDirection: "column",
    padding: 0,
    marginBottom: 10,

    "& span.icon": {
      width: 18,
      height: 18,
      fontSize: 18,
      display: "inline-block",
    },
  },
});

const on_message = function (messageEvent: any) {
  var wsMsg = messageEvent.data;
  console.log("WebSocket MESSAGE: " + wsMsg);
  if (wsMsg.indexOf("error") > 0) {
    console.log("error: " + wsMsg.error)
  }
}


const SystemViewPanel = React.memo(({ config, saveConfig }: Props) => {
  // TODO: configuration
  const { minLogLevel, searchTerms } = config;

  const [lrOrientation, setLROrientation] = useState<boolean>(true);
  const [direction, setDirection] = useState<CanvasDirection>('DOWN');

  const toggleOrientation = useCallback(() => {
    const canvas = canvasRef.current!;
    console.log(canvas);
    setLROrientation(!lrOrientation);
    setDirection(lrOrientation ? 'RIGHT' : 'DOWN');
    console.log(direction);
  }, [lrOrientation]);

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  const rosLogoURL = 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg';
  const wirelessURL = 'https://raw.githubusercontent.com/mjeronimo/studio/develop/packages/studio-base/src/panels/SystemView/assets/wireless.svg';

  const initialNodes: MyNodeData[] = [
    {
      id: '3', text: '/stereo_camera_controller',
      visible: true,
      type: 'node',
      icon: {
        url: rosLogoURL,
        height: 25,
        width: 25,
      },
    },
    {
      id: '2', text: '/left/image_raw',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      },
    },
    {
      id: '4', text: '/right/image_raw',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      },
    },
    {
      id: '5', text: '/image_adjuster_left_stereo',
      visible: true,
      type: 'node',
      icon: {
        url: rosLogoURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '7', text: '/image_adjuster_right_stereo',
      visible: true,
      type: 'node',
      icon: {
        url: rosLogoURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '8', text: '/disparity_node',
      visible: true,
      type: 'node',
      icon: {
        url: rosLogoURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '9', text: '/point_cloud_node',
      visible: true,
      type: 'node',
      icon: {
        url: rosLogoURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '10', text: '/left/image_raw/adjusted_stereo',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '11', text: '/right/image_raw/adjusted_stereo',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '12', text: '/disparity',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      }
    },
    {
      id: '13', text: '/points2',
      visible: true,
      type: 'topic',
      icon: {
        url: wirelessURL,
        height: 25,
        width: 25
      }
    },
  ]

  const edges: EdgeData<any>[] = [
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

  const [selections, setSelections] = useState<string[]>([]);
  const [nodes, setNodes] = useState<MyNodeData[]>(initialNodes);

  // const [edges, setEdges] = useState<EdgeData[]>(initialEdges);
  // <button style={{ position: 'absolute', top: 40, left: 10, zIndex: 999 }} onClick={() => canvasRef.current!.fitCanvas!()}>Fit</button>

const OneInfo = (): JSX.Element => {
  useEffect(() => {
    sendNotification(
      "Here's a helpful tip",
      "These are the details of the message",
      "user",
      "info",
    );
  }, []);

  return <SendNotificationToastAdapter />;
};


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
          type: 'node',
          text: `/node-${Math.random().toFixed(4)}`,
          icon: {
            url: rosLogoURL,
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






              <Toolbar>
              <br/>
        <ExpandingToolbar
          tooltip="Inspect objects"
          icon={
            <FoxgloveIcon style={{ color: "white" }}>
              <CursorDefault />
            </FoxgloveIcon>
          }
          className={styles.buttons}
          selectedTab={"Foobar1"}
          onSelectTab={(newSelectedTab) => console.log("onSelectTab")}
        >
          <ToolGroup name={"Foobar1"}>
            <ToolGroupFixedSizePane>
              <Checkbox
                label="Open this panel automatically"
                checked={true}
                onChange={() => console.log("onChange")}
              />
            </ToolGroupFixedSizePane>
          </ToolGroup>
          <ToolGroup name={"Foobar2"}>
            <ToolGroupFixedSizePane>
              <Checkbox
                label="Don't open this panel automatically"
                checked={true}
                onChange={() => console.log("onChange")}
              />
            </ToolGroupFixedSizePane>
          </ToolGroup>
        </ExpandingToolbar>

                <div className={styles.buttons}>
                  <Button className={styles.iconButton} tooltip="Open node panel" onClick={openPanel}>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      <PaneOpen24Regular />
                    </FoxgloveIcon>
                  </Button>
                  <Button className={styles.iconButton} tooltip="Fit graph to window" onClick={() => resetTransform()}>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      <FitToPageIcon />
                    </FoxgloveIcon>
                  </Button>
                  <Button className={styles.iconButton} tooltip="Zoom in" onClick={() => {
                    const canvas = canvasRef.current!;
                    if (canvas.zoomIn) {
                      canvas.zoomIn();
                    }
                  }
                  }>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      <Plus />
                    </FoxgloveIcon>
                  </Button>
                  <Button className={styles.iconButton} tooltip="Zoom out" onClick={() => {
                    const canvas = canvasRef.current!;
                    if (canvas.zoomOut) {
                      canvas.zoomOut();
                    }
                  }
                  }>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      <Minus />
                    </FoxgloveIcon>
                  </Button>
                  <Button className={styles.iconButton} tooltip="Change graph orientation" onClick={toggleOrientation}>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      {lrOrientation ? <ArrowLeftRightIcon /> : <ArrowUpDownIcon />}
                    </FoxgloveIcon>
                  </Button>
                </div>
              </Toolbar>
              <TransformComponent>
                <div>
                  <style>
                    {`
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
                        style = {{
                          boxShadow: "10px 10px 8px #ff0000",
                        }}
                        icon={<Icon />}
                        linkable={false}
                        onClick={(event, node) => {
                          console.log('Selecting Node', event, node);
                          setSelections([node.id]);
                        }}
                        onRemove={(event, node) => {
                          console.log('Removing Node', event, node);
                          // const result = removeNode(nodes, edges, node.id);
                          // setEdges(result.edges);
                          // setNodes(result.nodes);
                          setSelections([]);
                        }}
                      />
                    }
                    edge={<Edge
                      className="edge" />}
                      onCanvasClick={(event) => {
                      console.log('Canvas Clicked', event);
                      setSelections([]);
                    }}
                    onLayoutChange={layout => console.log('Layout', layout)} >
              </Canvas>
            </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
        <NodePanel isOpen={isOpen} openPanel={openPanel} dismissPanel={dismissPanel} nodes={nodes} edges={edges} />
      </Stack>
    </Stack>
  );
});

    // <StudioToastProvider />

SystemViewPanel.displayName = "SystemView";

export default Panel(
  Object.assign(SystemViewPanel, {
    // TODO: configuration
    defaultConfig: { searchTerms: [], minLogLevel: 1, topicToRender: "/rosout" } as Config,
    panelType: "SystemView",
  }),
);
