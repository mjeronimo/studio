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

import { memo, FC, CSSProperties } from 'react';
import { Handle, NodeProps } from 'react-flow-renderer';

const RosTopic: FC<NodeProps> = ({ data }) => {
  const nodeStyle: CSSProperties = { border: '1px solid red' };
  const targetHandleStyle: CSSProperties = { background: '#555' };
  const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
  const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

  return (
      <div style={nodeStyle}>
        <div>
          <strong>{data.label}</strong>
        </div>
        <Handle type="target" position={data.targetPosition} />
        <Handle type="source" position={data.sourcePosition} />
      </div>
  );
};

export default memo(RosTopic);
