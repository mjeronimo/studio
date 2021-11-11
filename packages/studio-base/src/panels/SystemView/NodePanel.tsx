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
import { Panel } from '@fluentui/react/lib/Panel';
import { Checkbox, PanelType, Text, useTheme } from "@fluentui/react";

import styled from "styled-components";

const options: IChoiceGroupOption[] = [
  { key: 'A', text: 'Automatically include all nodes' },
  { key: 'M', text: 'Manually select nodes' },
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
}

const STableContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

const STable = styled.div`
  max-width: 100%;
  min-width: 400px;
  overflow: auto;
`;

const SRow = styled.div`
  &:nth-child(even) {
    background: #333;
  }
`;

const SCell = styled.div`
  border: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.6;
  width: 100%;
  display: inline-block;
  padding: 2px 8px;
  white-space: nowrap;
`;

const SHeader = styled.div`
  font-size: 14px;
  border-bottom: #333 solid 2px;
`;

const STitle = styled.div`
  padding: 2px 8px;
`;

const SHeaderItem = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;

const NodePanel: React.FunctionComponent<NodePanelProps> = (props) => {

  return (
    <div>
      <br />
      <Panel
        headerText="Node List"
        isBlocking={false}
        isOpen={props.isOpen}
        onDismiss={props.dismissPanel}
        closeButtonAriaLabel="Close"
        customWidth="425px"
        type={PanelType.custom}
      >
        <br />
        <SectionHeader>Visibility</SectionHeader>
        <Checkbox label={`Include hidden nodes`} />

        <br />
        <SectionHeader>Selection Method</SectionHeader>
        <ChoiceGroup defaultSelectedKey="A" options={options} label="" required={true} />

        <br />
        <SectionHeader>Nodes</SectionHeader>

      <STableContainer>
        <STable>
            <SRow key={"topic.name"}>
              <SCell title={`Click to copy topic name to clipboard.`} >
                /viper/stereo_camera_controller
              </SCell>
            </SRow>
            <SRow key={"topic.name"}>
              <SCell title={`Click to copy topic type to clipboard.`} >
                /viper/image_adjuster_left_stereo
              </SCell>
            </SRow>
            <SRow key={"topic.name"}>
              <SCell title={`Click to copy topic name to clipboard.`} >
                /viper/image_adjuster_right_stereo
              </SCell>
            </SRow>
            <SRow key={"topic.name"}>
              <SCell title={`Click to copy topic type to clipboard.`} >
                /viper/disparity_node
              </SCell>
            </SRow>
            <SRow key={"topic.name"}>
              <SCell title={`Click to copy topic name to clipboard.`} >
                /viper/point_cloud_node
              </SCell>
            </SRow>
        </STable>
      </STableContainer>

      </Panel>
    </div>
  );
};

export default memo(NodePanel);
