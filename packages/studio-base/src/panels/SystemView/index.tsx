// React 
import { MouseEvent, useState, useCallback } from "react";

// FluentUI
import { Stack } from "@fluentui/react";

// Foxglove
import Panel from "@foxglove/studio-base/components/Panel";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Button from "@foxglove/studio-base/components/Button";

// Reaflow
import { Canvas, CanvasRef, Node, Edge, MarkerArrow, Port, Icon, Arrow, Label, Remove, Add, NodeProps, EdgeProps } from 'reaflow';

// Local
import helpContent from "./index.help.md";
import RosNode from "./RosNode";
import RosTopic from "./RosTopic";
import NodePanel from "./NodePanel";
import { ws_connect, ws_disconnect } from "./WebSocketClient"

//const onLoad = (reactFlowInstance: OnLoadParams) => {
//  ws_connect();
//  console.log('flow loaded:', reactFlowInstance);
//}

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

const SystemViewPanel = React.memo(({ config, saveConfig }: Props) => {

  // TODO: configuration
  const { minLogLevel, searchTerms } = config;

  return (
    <Stack verticalFill>
      <PanelToolbar helpContent={helpContent} floating />
      <Stack grow>
      <div 
      style={{ 
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: 0, 
          right: 0,
          // backgroundColor: 'blue',
          // backgroundImage: 'repeating-radial-gradient(top center,rgba(1.0,0,0,.2),rgba(1.0,0,0,.2) 10px, transparent 0, transparent 100%)',
          // background: 'repeating-radial-gradient(red, yellow 10%, green 15%)'

          // background: '666',
          // backgroundImage: 'linear-gradient(45deg, #bbb 25%, transparent 0), linear-gradient(45deg, transparent 75%, #bbb 0)',
          // backgroundPosition: '0 0, 25px 25px',
          // backgroundSize: '30px 30px',
          }} >
    <Canvas
      // required to enable edges from/to nested nodes
      pannable={true}
      fit={true}
      center={true}
      nodes={[
          { id: '3', text: 'stereo_camera_controller',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                },
          },
          { id: '2', text: '/left/image_raw',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                height: 25,
                width: 25
                },
          },
          { id: '4', text: '/right/image_raw',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                height: 25,
                width: 25
                },
          },
          { id: '5', text: 'image_adjuster_left_stereo',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '7', text: 'image_adjuster_right_stereo',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '8', text: 'disparity_node',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '9', text: 'point_cloud_node',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '10', text: '/left/image_raw/adjusted_stereo',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '11', text: '/right/image_raw/adjusted_stereo',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-flashpoint-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '12', text: '/disparity',
            icon: {
                url: 'https://s3.amazonaws.com/img.crft.app/package-slack-logo-bw.svg',
                height: 25,
                width: 25
                }
          },
          { id: '13', text: '/points2',
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
          { id: 'e10-8', from: '10', to: '8', text: '15 Hz' },
          { id: 'e10-9', from: '10', to: '9', text: '16 Hz' },
          { id: 'e5-10', from: '5', to: '10', text: '17 Hz' },
          { id: 'e11-8', from: '11', to: '8', text: '18 Hz' },
          { id: 'e12-9', from: '12', to: '9', text: '19 Hz' },
          { id: 'e8-12', from: '8', to: '12', text: '20 Hz' },
          { id: 'e9-13', from: '9', to: '13', text: '21 Hz' },
      ]}
      node={
        <Node
          icon={<Icon />}
        />
      }

      // direction="RIGHT"
      onLayoutChange={layout => console.log('Layout', layout)} />
      </div>
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
