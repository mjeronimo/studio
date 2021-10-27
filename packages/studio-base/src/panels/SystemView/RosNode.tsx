import React, { memo, FC, CSSProperties } from 'react';

import { Handle, Position, NodeProps, Connection, Edge } from 'react-flow-renderer';

import Icon from "@foxglove/studio-base/components/Icon";
import PiIcon from './Raspberry_Pi-Logo.wine.svg';

const nodeStyle: CSSProperties = { background: 'blue', border: '0px solid #AAA' };
const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);


const RosNode: FC<NodeProps> = ({ data }) => {
  return (
    <div style={nodeStyle} >
      <div>
        <Icon style={{ color: "white" }} size="medium" >
          <PiIcon />
        </Icon>
        <strong>{data.title}</strong>
      </div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(RosNode);
