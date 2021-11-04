// import * as React from 'react';
import React, { memo, CSSProperties } from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';

import NodeList from './NodeList';

import { PanelType } from "@fluentui/react";

import { ILabelStyles, IStyleSet, Label } from '@fluentui/react';
import { Pivot, PivotItem } from '@fluentui/react-tabs';

import { Separator } from '@fluentui/react/lib/Separator';

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

// <Label styles={labelStyles}>Pivot #1</Label>

const NodePanel: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  return (
    <div>
      <br />
      <DefaultButton text="Open panel" onClick={openPanel} />
      <Panel
        headerText="ROS 2 Node List"
        // this prop makes the panel non-modal
        isBlocking={false}
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        customWidth="425px"
        type={PanelType.custom}
      >
          <Separator />
          <Pivot aria-label="Basic Pivot Example">
            <PivotItem
              headerText="Logical"
              headerButtonProps={{
                'data-order': 1,
                'data-title': 'My Files Title',
              }}
            >
                <NodeList/>
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
