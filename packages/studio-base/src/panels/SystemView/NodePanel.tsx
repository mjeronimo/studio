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

import React, { memo, CSSProperties } from 'react';

import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Checkbox, PanelType, Text, useTheme } from "@fluentui/react";
import { ILabelStyles, IStyleSet, Label } from '@fluentui/react';
import { Pivot, PivotItem } from '@fluentui/react-tabs';

import NodeList from './NodeList';

const options: IChoiceGroupOption[] = [
  { key: 'A', text: 'Automatically include all nodes' },
  { key: 'M', text: 'Manually select nodes' },
];

const openStyle: CSSProperties = { position: 'absolute', left: 5, top: 5, zIndex: 4 };
const labelStyle: Partial<IStyleSet<ILabelStyles>> = { root: { marginTop: 10 }, };

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

const NodePanel: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  return (
    <div>
      <br />
      <DefaultButton text="Open panel" onClick={openPanel} style={openStyle} />
      <Panel
        headerText="Node List"
        isBlocking={false}
        // isLightDismiss
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        customWidth="425px"
        type={PanelType.custom}
      >
        <br/>
        <SectionHeader>Selection Method</SectionHeader>
        <ChoiceGroup defaultSelectedKey="A" options={options} label="" required={true} />

        <br/>
        <SectionHeader>Visibility</SectionHeader>
        <Checkbox label={`Include hidden nodes`} />

        <br/>
        <SectionHeader>Nodes</SectionHeader>
        <Pivot aria-label="Basic Pivot Example">
          <PivotItem
            headerText="Logical"
            headerButtonProps={{
              'data-order': 1,
              'data-title': 'My Files Title',
            }}
          >
            <NodeList />
          </PivotItem>
          <PivotItem headerText="Physical">
            <Label styles={labelStyle}>Physical View</Label>
          </PivotItem>
          <PivotItem headerText="Alphabetized">
            <Label styles={labelStyle}>Alphabetized List</Label>
          </PivotItem>
        </Pivot>
      </Panel>
    </div>
  );
};

export default memo(NodePanel);
