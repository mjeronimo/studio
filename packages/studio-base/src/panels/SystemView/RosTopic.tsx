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
import { memo, FC, CSSProperties } from 'react';
import { Handle, NodeProps } from 'react-flow-renderer';

const RosTopic: FC<NodeProps> = (props: NodeProps) => {
  const theme = useTheme();

  const nodeStyle: CSSProperties = {
    border: props.selected? '1px solid red' : '0px solid red',
    fontFamily: theme.fonts.medium.fontFamily,
    fontSize: theme.fonts.medium.fontSize,
    fontWeight: theme.fonts.medium.fontWeight as number,
    height: '100%',
    width: '100%',
  };

  const handleStyle: CSSProperties = {
    backgroundColor: 'transparent',
    border: '0px solid red',
    height: '1px',
    width: '1px',
  };

  return (
    <div style={nodeStyle}>
      <div>{props.data.label}</div>
      <Handle type="target" style={handleStyle} position={props.targetPosition!} />
      <Handle type="source" style={handleStyle} position={props.sourcePosition!} />
    </div>
  );
};

export default memo(RosTopic);
