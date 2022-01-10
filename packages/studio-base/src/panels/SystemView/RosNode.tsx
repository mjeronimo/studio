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

import { useTheme } from "@fluentui/react";
import ChevronRightIcon from "@mdi/svg/svg/chevron-right.svg";
import CloseIcon from "@mdi/svg/svg/close.svg";
import { memo, FC, CSSProperties } from 'react';
import { Handle, NodeProps } from 'react-flow-renderer';

import Icon from "@foxglove/studio-base/components/Icon";

import NodeIcon from "./assets/icons/ros_logo.svg";

const RosNode: FC<NodeProps> = ({ data }) => {
  const theme = useTheme();
  //background: theme.palette.themeLighter,

  const nodeStyle: CSSProperties = {
    boxSizing: "border-box",
    margin: "0px",
    minWidth: "0px",

    //padding: "0px",
    //backgroundColor: 'rgb(34, 33, 56)',
    padding: "2px",
    backgroundColor: "black",

    border: '2px solid rgb(51, 49, 84)',
    color: "rgb(255,255,255)",
    position: "relative",
    boxShadow: "non !important",
    width: '100%',
    height: '100%',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: theme.fonts.medium.fontSize,
    fontWeight: theme.fonts.medium.fontWeight as number,
  };

  const headerStyle: CSSProperties = {
    backgroundColor: 'rgb(34, 33, 56)',

    border: '0px solid green',
    padding: "8px",
    display: "flex",
    borderBottom: '1px solid rgb(51, 49, 84)',
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyle: CSSProperties = {
    border: '0px solid red',
    display: "flex",
  };

  const closeStyle: CSSProperties = {
    border: '0px solid red',
    cursor: "pointer",
    pointerEvents: "all",
    opacity: "0.25",
  };

  const bodyStyle: CSSProperties = {
    backgroundColor: 'rgb(34, 33, 56)',
    color: "rgb(255,255,255,0.5)",

    border: '0px solid red',
    padding: "8px",
  };

  const targetHandleStyle: CSSProperties = { background: '#555' };
  const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
  const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

  return (
    <div style={nodeStyle} >
      <div style={headerStyle}>
        <div style={titleStyle}>
          <Icon style={{ color: "white", marginRight: "8px" }} size="xsmall">
            <NodeIcon />
          </Icon>
          {data.label}
        </div>
        <div style={closeStyle}>
          <Icon style={{ color: "white" }} size="xsmall">
            <CloseIcon />
          </Icon>
        </div>
      </div>
      <div style={bodyStyle}>
        <Icon size="xsmall">
          <ChevronRightIcon />
        </Icon>
        Parameters
      </div>
      <Handle type="target" position={data.targetPosition} />
      <Handle type="source" position={data.sourcePosition} />
    </div>
  );
};

export default memo(RosNode);
