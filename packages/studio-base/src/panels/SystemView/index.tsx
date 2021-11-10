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
import { MouseEvent, useState, useCallback, CSSProperties, useRef } from "react";
import { useBoolean } from '@fluentui/react-hooks';

// FluentUI
import { Stack } from "@fluentui/react";
import { DefaultButton } from '@fluentui/react/lib/Button';
import { mergeStyleSets } from "@fluentui/react";
import { PaneOpen24Regular } from "@fluentui/react-icons";

import ServiceIcon from "@mdi/svg/svg/rectangle-outline.svg";
import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";
import ArrowLeftRightIcon from "@mdi/svg/svg/arrow-left-right.svg";
import ArrowUpDownIcon from "@mdi/svg/svg/arrow-up-down.svg";
import PlusIcon from "@mdi/svg/svg/shape-square-plus.svg";
import Plus from "@mdi/svg/svg/plus.svg";
import Minus from "@mdi/svg/svg/minus.svg";

// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Button from "@foxglove/studio-base/components/Button";
import { colors } from "@foxglove/studio-base/util/sharedStyleConstants";
import FoxgloveIcon from "@foxglove/studio-base/components/Icon";

// Reaflow
import { Canvas, CanvasDirection, CanvasRef, Node, Edge, MarkerArrow, Port, Icon, Arrow, Label, Remove, Add, NodeProps, EdgeProps, } from 'reaflow';

// react-zoom-pan-pinch
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// SystemView
import helpContent from "./index.help.md";
import NodePanel from "./NodePanel";
import { ws_connect, ws_disconnect } from "./WebSocketClient"
import Toolbar from "./Toolbar";

const canvasRef = React.createRef<CanvasRef>();

// TODO: Define the default configuration for this panel
type Config = {
  searchTerms: string[];
  minLogLevel: number;
  topicToRender: string;
};

const controlsStyle: CSSProperties = { position: 'absolute', left: 5, top: 205, zIndex: 4 };

type Props = {
  config: Config;
  saveConfig: (arg0: Config) => void;
};


const styles = mergeStyleSets({
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


const SystemViewPanel = React.memo(({ config, saveConfig }: Props) => {
  // TODO: configuration
  const { minLogLevel, searchTerms } = config;

  const getDirection = () => {
    const canvas = canvasRef.current!;
    console.log(canvas);
    if (canvas.fitCanvas) {
      canvas.fitCanvas();
    }
    console.log(canvas);
  }

  const [lrOrientation, setLROrientation] = useState<boolean>(false);
  const [showServices, setShowServices] = useState<boolean>(true);
  const [direction, setDirection] = useState<CanvasDirection>('RIGHT');

  const onZoomFit = useCallback(() => {
    //graph.current?.fit();
  }, []);

  const toggleOrientation = useCallback(() => {
    setLROrientation(!lrOrientation);
    setDirection(lrOrientation ? 'RIGHT' : 'DOWN');
  }, [lrOrientation]);

  const toggleShowServices = useCallback(() => {
    // graph.current?.resetUserPanZoom();
    setShowServices(!showServices);
  }, [showServices]);

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  let rosLogoURL = 'https://raw.githubusercontent.com/mjeronimo/studio/a802e32713b70509f49247c7dae817231ab9ec57/packages/studio-base/src/panels/SystemView/assets/ros_logo.svg';
  let wirelessURL = 'https://raw.githubusercontent.com/mjeronimo/studio/develop/packages/studio-base/src/panels/SystemView/assets/wireless.svg';

  return (
    <Stack verticalFill>
      <PanelToolbar helpContent={helpContent} floating />
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
                  <Button className={styles.iconButton} tooltip="Zoom in" onClick={() => zoomIn()}>
                    <FoxgloveIcon style={{ color: "white" }} size="small">
                      <Plus />
                    </FoxgloveIcon>
                  </Button>
                  <Button className={styles.iconButton} tooltip="Zoom out" onClick={() => zoomOut()}>
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
                <Canvas
                  // required to enable edges from/to nested nodes
                  ref={canvasRef}
                  zoomable={false}
                  fit={true}
                  center={true}
                  nodes={[
                    {
                      id: '3', text: 'stereo_camera_controller',
                      icon: {
                        url: rosLogoURL,
                        height: 25,
                        width: 25,
                      },
                    },
                    {
                      id: '2', text: '/left/image_raw',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      },
                    },
                    {
                      id: '4', text: '/right/image_raw',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      },
                    },
                    {
                      id: '5', text: 'image_adjuster_left_stereo',
                      icon: {
                        url: rosLogoURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '7', text: 'image_adjuster_right_stereo',
                      icon: {
                        url: rosLogoURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '8', text: 'disparity_node',
                      icon: {
                        url: rosLogoURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '9', text: 'point_cloud_node',
                      icon: {
                        url: rosLogoURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '10', text: '/left/image_raw/adjusted_stereo',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '11', text: '/right/image_raw/adjusted_stereo',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '12', text: '/disparity',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      }
                    },
                    {
                      id: '13', text: '/points2',
                      icon: {
                        url: wirelessURL,
                        height: 25,
                        width: 25
                      }
                    },

                  ]}
                  edges={[
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
                  ]}
                  node={
                    <Node
                      icon={<Icon />}
                      linkable={false}
                    />
                  }

                  direction={direction}
                  onLayoutChange={layout => console.log('Layout', layout)} />
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
        <NodePanel isOpen={isOpen} openPanel={openPanel} dismissPanel={dismissPanel} />
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