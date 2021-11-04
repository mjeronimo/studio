
export interface IRosNode {
  node_name: string;
  node_namespace: string;
  node_with_namespace: string;
  hostname: string;
  process_id: string;
  key: string;
}

export interface INodeGroup {
  count: number;
  key: string;
  name: string;
  startIndex: number;
  level?: number;
  isCollapsed?: boolean;
  children?: INodeGroup[];
}

export function getRosNodes(): IRosNode[] {
  let nodes: IRosNode[] = [];

  nodes.push({ node_name: "stereo_camera_controller", node_namespace: "/viper", node_with_namespace: "/viper/stereo_camera_controller", hostname: "bluenote", process_id: "1545", key: "item-1" });
  nodes.push({ node_name: "image_adjuster_left_stereo", node_namespace: "/viper", node_with_namespace: "/viper/image_adjuster_left_stereo", hostname: "bluenote", process_id: "1546", key: "item-2" });
  nodes.push({ node_name: "image_adjuster_right_stereo", node_namespace: "/viper", node_with_namespace: "/viper/image_adjuster_right_stereo", hostname: "bluenote", process_id: "1547", key: "item-3" });
  nodes.push({ node_name: "disparity_node", node_namespace: "/viper", node_with_namespace: "/viper/disparity_node", hostname: "bluenote", process_id: "1548", key: "item-4" });
  nodes.push({ node_name: "point_cloud_node", node_namespace: "/viper", node_with_namespace: "/viper/point_cloud_node", hostname: "bluenote", process_id: "1549", key: "item-5" });
  nodes.push({ node_name: "node6", node_namespace: "/viper", node_with_namespace: "/viper/node6", hostname: "bluenote", process_id: "1550", key: "item-6" });
  nodes.push({ node_name: "node7", node_namespace: "/viper", node_with_namespace: "/viper/node7", hostname: "bluenote", process_id: "1551", key: "item-7" });
  nodes.push({ node_name: "node8", node_namespace: "/viper", node_with_namespace: "/viper/node8", hostname: "bluenote", process_id: "1552", key: "item-8" });
  nodes.push({ node_name: "node9", node_namespace: "/viper", node_with_namespace: "/viper/node9", hostname: "bluenote", process_id: "1553", key: "item-9" });
  nodes.push({ node_name: "node10", node_namespace: "/viper", node_with_namespace: "/viper/node10", hostname: "bluenote", process_id: "1554", key: "item-10" });

  return nodes;
}

export function createGroups(): INodeGroup[] {
  let subgroup1: INodeGroup[] = [];
  subgroup1.push({ count: 2, key: "Host0-0", name: "pid: 12345", startIndex: 0, level: 1, isCollapsed: false, children: [] });
  subgroup1.push({ count: 2, key: "Host0-1", name: "pid: 12346", startIndex: 2, level: 1, isCollapsed: false, children: [] });

  let subgroup2: INodeGroup[] = [];
  subgroup2.push({ count: 2, key: "Host1-0", name: "pid: 12347", startIndex: 4, level: 1, isCollapsed: false, children: [] });
  subgroup2.push({ count: 2, key: "Host1-1", name: "pid: 12348", startIndex: 6, level: 1, isCollapsed: false, children: [] });

  let groups: INodeGroup[] = [];
  groups.push({ count: 4, key: "Domain0", name: "host: bluenote", startIndex: 0, level: 0, isCollapsed: false, children: subgroup1 });
  groups.push({ count: 4, key: "Domain1", name: "host: coltrane", startIndex: 4, level: 0, isCollapsed: false, children: subgroup2 });
  return groups;
}
