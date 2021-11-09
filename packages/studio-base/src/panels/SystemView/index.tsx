// React
import { MouseEvent, useState, useCallback, CSSProperties, useRef } from "react";

// FluentUI
import { Stack } from "@fluentui/react";
import { DefaultButton } from '@fluentui/react/lib/Button';

// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Button from "@foxglove/studio-base/components/Button";

// Reaflow
import { Canvas, CanvasDirection, CanvasRef, Node, Edge, MarkerArrow, Port, Icon, Arrow, Label, Remove, Add, NodeProps, EdgeProps, } from 'reaflow';

// react-zoom-pan-pinch
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// SystemView
import helpContent from "./index.help.md";
import NodePanel from "./NodePanel";
import { ws_connect, ws_disconnect } from "./WebSocketClient"

const canvasRef = React.createRef<CanvasRef>();

// TODO: Define the default configuration for this panel
type Config = {
  searchTerms: string[];
  minLogLevel: number;
  topicToRender: string;
};

const horizontalStyle: CSSProperties = { position: 'absolute', left: 5, top: 45, zIndex: 4 };
const verticalStyle: CSSProperties = { position: 'absolute', left: 5, top: 85, zIndex: 4 };
const fitStyle: CSSProperties = { position: 'absolute', left: 5, top: 125, zIndex: 4 };
const centerStyle: CSSProperties = { position: 'absolute', left: 5, top: 165, zIndex: 4 };

const controlsStyle: CSSProperties = { position: 'absolute', left: 5, top: 205, zIndex: 4 };

const canvasStyle: CSSProperties = {
  backgroundColor: 'white',
  backgroundImage: '-webkit-repeating-radial-gradient(top center,rgba(0,0,0,.2),rgba(0,0,0,.2) 1px,transparent 0,transparent 100%)',
};

type Props = {
  config: Config;
  saveConfig: (arg0: Config) => void;
};

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

  return (
    <Stack verticalFill>
      <PanelToolbar helpContent={helpContent} floating />
      <DefaultButton text="Horizontal" onClick={() => getDirection()} style={horizontalStyle} />
      <DefaultButton text="Vertical" style={verticalStyle} />
      <DefaultButton text="Fit" style={fitStyle} />
      <DefaultButton text="Center" style={centerStyle} />
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
            <div className="tools" style={controlsStyle} >
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>100%</button>
            </div>

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
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                },
              },
              {
                id: '2', text: '/left/image_raw',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                  height: 25,
                  width: 25
                },
              },
              {
                id: '4', text: '/right/image_raw',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                  height: 25,
                  width: 25
                },
              },
              {
                id: '5', text: 'image_adjuster_left_stereo',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '7', text: 'image_adjuster_right_stereo',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '8', text: 'disparity_node',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '9', text: 'point_cloud_node',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '10', text: '/left/image_raw/adjusted_stereo',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '11', text: '/right/image_raw/adjusted_stereo',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '12', text: '/disparity',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                  height: 25,
                  width: 25
                }
              },
              {
                id: '13', text: '/points2',
                icon: {
                  url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
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
              />
            }

            direction={"DOWN"}
            onLayoutChange={layout => console.log('Layout', layout)} />
              </TransformComponent>
    </React.Fragment>
    )}
</TransformWrapper>
        <NodePanel />
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
