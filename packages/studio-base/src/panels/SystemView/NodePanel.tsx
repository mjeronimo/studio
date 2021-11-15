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

// React
import React, { memo, useState } from 'react';

// Fluent UI
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { Panel } from '@fluentui/react/lib/Panel';
import { Checkbox, PanelType, Text, useTheme } from "@fluentui/react";

// reaflow
import { NodeData, EdgeData } from 'reaflow';

// SystemView
import { NodeList } from "./NodeList";
import { MyNodeData } from "./MyNodeData";

const displayOptions: IChoiceGroupOption[] = [
  { key: 'L', text: 'Logical' },
  { key: 'P', text: 'Physical' },
  { key: 'N', text: 'No node grouping' },
];

function SectionHeader({ children }: React.PropsWithChildren<unknown>) {
  const theme = useTheme();
  return (
    <Text
      block
      as="h2"
      variant="large"
      style={{
        marginBottom: theme.spacing.s1,
        color: theme.palette.themeSecondary,
      }}
    >
      {children}
    </Text>
  );
}

interface NodePanelProps {
  isOpen: boolean | undefined
  openPanel: () => void
  dismissPanel: () => void
  nodes: MyNodeData[]
  edges: EdgeData<any>[]
}

const NodePanel: React.FunctionComponent<NodePanelProps> = (props) => {

  const [selectedList, setSelectedList] = useState([]);

  const handleChange = (e: any) => {
    let { options } = e.target;
    options = Array.apply(null, options)
    const selectedValues = options.filter((x: any) => x.selected).map((x: any) => x.value);
    setSelectedList(selectedValues);
  }

  return (
    <div>
      <br />
      <Panel
        headerText="Node Display"
        isBlocking={false}
        isOpen={props.isOpen}
        onDismiss={props.dismissPanel}
        closeButtonAriaLabel="Close"
        customWidth="425px"
        type={PanelType.custom}
      >
        <br />
        <SectionHeader>Options</SectionHeader>
        <Checkbox label={`Include hidden nodes`} />
        <br />
        <Checkbox label={`Automatically display new nodes`} />
        <br />
        <ChoiceGroup defaultSelectedKey="L" options={displayOptions} label="Node Grouping" required={false} />
        <br />
        <SectionHeader>Node Selection</SectionHeader>
        <NodeList nodes={props.nodes} edges={props.edges} />
      </Panel>
    </div>
  );
};

export default memo(NodePanel);
