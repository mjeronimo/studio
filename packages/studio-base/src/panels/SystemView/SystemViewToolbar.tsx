
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
import React, { useState, useCallback } from "react";

// Foxglove
import Button from "@foxglove/studio-base/components/Button";
import Checkbox from "@foxglove/studio-base/components/Checkbox";
import ExpandingToolbar, { ToolGroup } from "@foxglove/studio-base/components/ExpandingToolbar";
import FoxgloveIcon from "@foxglove/studio-base/components/Icon";
import SegmentedControl, { Option } from "@foxglove/studio-base/components/SegmentedControl";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

// ReactFlow
import { useStoreActions, useStoreState, useZoomPanHelper, FitViewParams, Elements } from 'react-flow-renderer';

// SystemView
import Toolbar from "./Toolbar";
import { NodeList } from "./NodeList";

// MDI icons
import ArrowLeftRightIcon from "@mdi/svg/svg/arrow-left-right.svg";
import ArrowUpDownIcon from "@mdi/svg/svg/arrow-up-down.svg";
import FitviewIcon from "./assets/icons/fitview.svg";
import GroupIcon from "@mdi/svg/svg/group.svg";
import LockIcon from "@mdi/svg/svg/lock-outline.svg";
import MinusIcon from "@mdi/svg/svg/minus.svg";
import PlusIcon from "@mdi/svg/svg/plus.svg";
import SelectionIcon from "@mdi/svg/svg/checkbox-multiple-marked-outline.svg";
import UnlockIcon from "@mdi/svg/svg/lock-open-variant-outline.svg";

export type Props = {
  nodes: Elements
  edges: Elements
  lrOrientation: boolean
  fitViewParams?: FitViewParams
  setNodes?: any     // TODO
  setEdges?: any     // TODO
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitview?: () => void
  onInteractiveChange?: (isInteractive: boolean) => void
  onToggleOrientation?: (lrOrientation: boolean) => void
  onSelectionChange: (selectedNodes: string[]) => void
};

export const SystemViewToolbar: React.FC<Props> = (props: Props) => {

  const [lrOrientation, setLROrientation] = useState<boolean>(props.lrOrientation);

  let defaultSelectedTab: string | undefined;
  const [selectedTab, setSelectedTab] = React.useState(defaultSelectedTab);

  let defaultSelectedTab2: string | undefined;
  const [selectedTab2, setSelectedTab2] = React.useState(defaultSelectedTab2);

  const GroupingOptions = {
    first: { id: "logical", label: "Logical", },
    second: { id: "physical", label: "Physical", },
    third: { id: "none", label: "None", },
  };

  const [selectedId, setSelectedId] = React.useState(GroupingOptions.third.id);
  const optionArray: Option[] = Object.values(GroupingOptions);

  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const isInteractive = useStoreState((s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable);

  const onToggleOrientation = () => { 
    const newOrientation = !lrOrientation;
    setLROrientation(newOrientation);
    props.onToggleOrientation?.(newOrientation);
  }

  const onZoomInHandler = () => {
    zoomIn?.();
    props.onZoomIn?.();
  }

  const onZoomOutHandler = () => {
    zoomOut?.();
    props.onZoomOut?.();
  }

  const onFitViewHandler = () => {
    fitView?.(props.fitViewParams);
    props.onFitview?.();
  }

  const onInteractiveChangeHandler = () => {
    setInteractive?.(!isInteractive);
    props.onInteractiveChange?.(!isInteractive);
  }

  return (
    <Toolbar>
      <br />
      <ExpandingToolbar
        tooltip="Group nodes"
        icon={
          <FoxgloveIcon style={{ color: "white" }}>
            <GroupIcon />
          </FoxgloveIcon>
        }
        className={styles.buttons}
        selectedTab={selectedTab}
        onSelectTab={(newSelectedTab) => {
          setSelectedTab(newSelectedTab!)
        }}
      >
        <ToolGroup name={"Node Grouping"}>
          <>
            <br />
            <SegmentedControl
              options={optionArray}
              selectedId={selectedId}
              onChange={(newId) => setSelectedId(newId)}
            />
          </>
        </ToolGroup>
      </ExpandingToolbar>
      <ExpandingToolbar
        tooltip="Select nodes to display"
        icon={
          <FoxgloveIcon style={{ color: "white" }}>
            <SelectionIcon />
          </FoxgloveIcon>
        }
        className={styles.buttons}
        selectedTab={selectedTab2}
        onSelectTab={(newSelectedTab) => {
          setSelectedTab2(newSelectedTab!)
        }}
      >
        <ToolGroup name={"Node List"}>
          <NodeList nodes={props.nodes.map((node) => { return { key: node.id, name: node.data.label as string, isHidden: node.isHidden as boolean } })} onSelectionChange={props.onSelectionChange} />
        </ToolGroup>
        <ToolGroup name={"Options"}>
          <>
            <Checkbox
              label="Automatically display new nodes"
              checked={false}
              onChange={() => console.log("onChange")}
            />
            <Checkbox
              label="Include hidden nodes"
              checked={false}
              onChange={() => console.log("onChange")}
            />
          </>
        </ToolGroup>
      </ExpandingToolbar>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Change graph orientation" onClick={onToggleOrientation}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            {lrOrientation ? <ArrowUpDownIcon /> : <ArrowLeftRightIcon />}
          </FoxgloveIcon>
        </Button>
      </div>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Zoom in graph" onClick={onZoomInHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <PlusIcon />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Zoom out graph" onClick={onZoomOutHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <MinusIcon />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Fit graph to window" onClick={onFitViewHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <FitviewIcon />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Lock/unlock the node positions" onClick={onInteractiveChangeHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            {isInteractive ? <UnlockIcon /> : <LockIcon />}
          </FoxgloveIcon>
        </Button>
      </div>
    </Toolbar>
  );
};
