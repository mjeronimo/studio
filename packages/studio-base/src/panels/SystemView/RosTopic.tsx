import React, { memo, FC, CSSProperties } from 'react';
import { Handle, Position, NodeProps, Connection, Edge } from 'react-flow-renderer';

const targetHandleStyle: CSSProperties = { background: '#555' };
// const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
// const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);

const RosTopic: FC<NodeProps> = ({ 
  data,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,

}) => {
  return (
    <>
      <div>
        <strong>{data.title}</strong>
      </div>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
    </>
  );
};

export default memo(RosTopic);
