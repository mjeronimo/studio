import React, { memo, CSSProperties } from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Checkbox, PanelType, Text, useTheme } from "@fluentui/react";
import { ILabelStyles, IStyleSet, Label } from '@fluentui/react';
import { Pivot, PivotItem } from '@fluentui/react-tabs';

import NodeList from './NodeList';

const openStyle: CSSProperties = { position: 'absolute', left: 5, top: 5, zIndex: 4 };
const horizontalStyle: CSSProperties = { position: 'absolute', left: 5, top: 45, zIndex: 4 };
const verticalStyle: CSSProperties = { position: 'absolute', left: 5, top: 85, zIndex: 4 };
const fitStyle: CSSProperties = { position: 'absolute', left: 5, top: 125, zIndex: 4 };
const centerStyle: CSSProperties = { position: 'absolute', left: 5, top: 165, zIndex: 4 };

const labelStyles: Partial<IStyleSet<ILabelStyles>> = { root: { marginTop: 10 }, };

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
      <DefaultButton text="Horizontal" style={horizontalStyle} />
      <DefaultButton text="Vertical" style={verticalStyle} />
      <DefaultButton text="Fit" style={fitStyle} />
      <DefaultButton text="Center" style={centerStyle} />
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
        <SectionHeader>Some Heading</SectionHeader>
        <Checkbox label={`Send usage data`} />
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
            <Label styles={labelStyles}>Physical View</Label>
          </PivotItem>
          <PivotItem headerText="Alphabetized">
            <Label styles={labelStyles}>Alphabetized List</Label>
          </PivotItem>
        </Pivot>
      </Panel>
    </div>
  );
};

export default memo(NodePanel);
