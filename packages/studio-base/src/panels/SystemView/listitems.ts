import { IObjectWithKey } from "@fluentui/react";

export interface IRosNode {
  domain: number;
  namespace: string;
  name: string;
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

  nodes.push({ domain: 0, namespace: "/viper", name: "stereo_camera_controller", hostname: "bluenote", process_id: "1545", key: "item-1" });
  nodes.push({ domain: 0, namespace: "/viper", name: "image_adjuster_left_stereo", hostname: "bluenote", process_id: "1546", key: "item-2" });
  nodes.push({ domain: 0, namespace: "/viper", name: "image_adjuster_right_stereo", hostname: "bluenote", process_id: "1547", key: "item-3" });
  nodes.push({ domain: 0, namespace: "/viper", name: "disparity_node", hostname: "bluenote", process_id: "1548", key: "item-4" });
  nodes.push({ domain: 0, namespace: "/viper", name: "point_cloud_node", hostname: "bluenote", process_id: "1549", key: "item-5" });
  nodes.push({ domain: 0, namespace: "/other", name: "node6", hostname: "bluenote", process_id: "1550", key: "item-6" });
  nodes.push({ domain: 0, namespace: "/other", name: "node7", hostname: "bluenote", process_id: "1551", key: "item-7" });
  nodes.push({ domain: 0, namespace: "/other", name: "node8", hostname: "bluenote", process_id: "1552", key: "item-8" });
  nodes.push({ domain: 0, namespace: "/other", name: "node9", hostname: "bluenote", process_id: "1553", key: "item-9" });
  nodes.push({ domain: 0, namespace: "/other", name: "node10", hostname: "bluenote", process_id: "1554", key: "item-10" });
  nodes.push({ domain: 0, namespace: "/other", name: "node11", hostname: "bluenote", process_id: "1555", key: "item-11" });
  nodes.push({ domain: 0, namespace: "/other", name: "node12", hostname: "bluenote", process_id: "1556", key: "item-12" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node13", hostname: "bluenote", process_id: "1557", key: "item-13" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node14", hostname: "bluenote", process_id: "1558", key: "item-14" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node15", hostname: "bluenote", process_id: "1559", key: "item-15" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node16", hostname: "bluenote", process_id: "1560", key: "item-16" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node17", hostname: "bluenote", process_id: "1561", key: "item-17" });
  nodes.push({ domain: 1, namespace: "/viper", name: "node18", hostname: "bluenote", process_id: "1562", key: "item-18" });

  return nodes;
}

export function createGroups(nodes: IObjectWithKey[]): INodeGroup[] {
  var domains = new Array();

  nodes.forEach(node => { 
    let n = node as IRosNode;
    if (domains[n.domain] == undefined) {
      domains[n.domain] = new Array();
    }

    if (domains[n.domain][n.namespace] == undefined) {
      domains[n.domain][n.namespace] = new Array();
    }

    domains[n.domain][n.namespace].push(n);
  });

  console.log(domains);

  // TODO: automatically generate the groups from the node list

  let subgroup1: INodeGroup[] = [];
  subgroup1.push({ count: 2, key: "Subgroup-0-0", name: "/viper", startIndex: 0, level: 1, isCollapsed: false, children: [] });
  subgroup1.push({ count: 2, key: "Subgroup-0-1", name: "/viper", startIndex: 2, level: 1, isCollapsed: false, children: [] });

  let subgroup2: INodeGroup[] = [];
  subgroup2.push({ count: 2, key: "Subgroup-1-0", name: "/viper", startIndex: 4, level: 1, isCollapsed: false, children: [] });
  subgroup2.push({ count: 4, key: "Subgroup-1-1", name: "/viper", startIndex: 6, level: 1, isCollapsed: false, children: [] });

  let groups: INodeGroup[] = [];
  groups.push({ count: 4, key: "Domain-0", name: "Domain 0", startIndex: 0, level: 0, isCollapsed: false, children: subgroup1 });
  groups.push({ count: 6, key: "Domain-1", name: "Domain 1", startIndex: 4, level: 0, isCollapsed: false, children: subgroup2 });
  return groups;
}
