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

import React, { memo, FC, CSSProperties } from 'react';
import { Dismiss12Regular, Info24Regular, Settings24Filled } from "@fluentui/react-icons";
import { Handle, Position, NodeProps, Connection, Edge } from 'react-flow-renderer';

import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";
import { Wrench24Regular } from "@fluentui/react-icons";
import Icon from "@foxglove/studio-base/components/Icon";

import Button from "@foxglove/studio-base/components/Button";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

const targetHandleStyle: CSSProperties = { background: '#555' };
// const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
// const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);
const settingsStyles: CSSProperties = { background: '#0078d7', border: 'none', position: 'absolute', right: '0px' };

const nodeStyle: CSSProperties = { background: 'blue', border: '0px solid #AAA' };
const nodeTitleStyle: CSSProperties = { color: 'white', background: '#6263a4', textAlign: 'left', padding: '5px', paddingLeft: '5px', border: '0px solid #000' };
const nodeBodyStyle: CSSProperties = { background: '#565899', height: '40px', border: 'none' };

const dismissStyle: CSSProperties = {
  color: 'white',
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  border: '1px solid #000',
};

const RosNode: FC<NodeProps> = ({ 
  data,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,

}) => {
  return (
    <div style={nodeStyle} >
      <div style={nodeTitleStyle} >
        <Icon style={{ color: "white", marginRight: "10px" }} size="small">
          <Wrench24Regular />
        </Icon>
        <strong>{data.title}</strong>
        <Button className={styles.iconButton} tooltip="Remove node from graph" style={dismissStyle}>
          <Dismiss12Regular />
        </Button>
      </div>
      <div style={nodeBodyStyle}>
        <Button className={styles.iconButton} tooltip="Display node parameters" style={settingsStyles} >
          <Settings24Filled />
        </Button>
      </div>
      <Handle type="target" position={targetPosition} style={targetHandleStyle} />
      <Handle type="source" position={sourcePosition} />
    </div>
  );
};

export default memo(RosNode);
