// import * as React from 'react';
import React, { memo, CSSProperties } from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';

import NodeList from './NodeList';

import { PanelType } from "@fluentui/react";

const NodePanel: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  return (
    <div>
      <br />
      <DefaultButton text="Open panel" onClick={openPanel} />
      <Panel
        headerText="Nodes"
        // this prop makes the panel non-modal
        isBlocking={false}
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        customWidth="425px"
        type={PanelType.custom}
      >
        <NodeList/>
      </Panel>
    </div>
  );
};

export default memo(NodePanel);
