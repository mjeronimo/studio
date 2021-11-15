import { NodeData } from 'reaflow';

export interface MyNodeData extends NodeData {
  type: string              // 'node' or 'topic'
  visible: boolean
};
