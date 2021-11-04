
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

//export function createGroups2(): INodeGroup[] {
//  let groups: INodeGroup[] = [];
//  groups.push({ count: 2, key: "/viper", name: "/viper/stereo_camera_controller", startIndex: 0, level: 0, isCollapsed: false, children: [] });
//  return groups;
//}

export function createGroups(
  groupCount: number,
  groupDepth: number,
  startIndex: number,
  itemsPerGroup: number,
  level: number = 0,
  key: string = '',
  isCollapsed?: boolean,
): INodeGroup[] {
  if (key !== '') {
    key = key + '-';
  }
  const count = Math.pow(itemsPerGroup, groupDepth);
  console.log("createGroups: count: " + count)
  return [...Array(groupCount)].map((value: number, index: number) => {
    return {
      count: count,
      key: 'Host' + key + index,
      name: 'Host ' + key + index,
      startIndex: index * count + startIndex,
      level: level,
      isCollapsed: isCollapsed,
      children:
        groupDepth > 1
          ? createGroups(groupCount, groupDepth - 1, index * count + startIndex, itemsPerGroup, level + 1, key + index)
          : [],
    };
  });
}
