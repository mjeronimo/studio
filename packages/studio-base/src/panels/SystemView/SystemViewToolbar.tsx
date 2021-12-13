// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

// Copyright 2022 Open Source Robotics Foundation, Inc.
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

import ArrowLeftRightIcon from "@mdi/svg/svg/arrow-left-right.svg";
import ArrowUpDownIcon from "@mdi/svg/svg/arrow-up-down.svg";
import SelectionIcon from "@mdi/svg/svg/checkbox-multiple-marked-outline.svg";
import GroupIcon from "@mdi/svg/svg/group.svg";
import UnlockIcon from "@mdi/svg/svg/lock-open-variant-outline.svg";
import LockIcon from "@mdi/svg/svg/lock-outline.svg";
import MinusIcon from "@mdi/svg/svg/minus.svg";
import PlusIcon from "@mdi/svg/svg/plus.svg";
import React, { useState } from "react";
import { Elements } from 'react-flow-renderer';

import Button from "@foxglove/studio-base/components/Button";
import Checkbox from "@foxglove/studio-base/components/Checkbox";
import ExpandingToolbar, { ToolGroup } from "@foxglove/studio-base/components/ExpandingToolbar";
import Icon from "@foxglove/studio-base/components/Icon";
import SegmentedControl, { Option } from "@foxglove/studio-base/components/SegmentedControl";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

import { NodeList, INodeListItem } from "./NodeList";
import Toolbar from "./Toolbar";
import FitviewIcon from "./assets/icons/fitview.svg";

export type Props = {
  nodes: Elements
  lrOrientation: boolean
  isInteractive: boolean
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitview?: () => void
  onInteractiveChange?: (isInteractive: boolean) => void
  onToggleOrientation?: (lrOrientation: boolean) => void
  onSelectionChange: (selectedNodes: string[]) => void
};

export const SystemViewToolbar: React.FC<Props> = (props: Props) => {

  const [lrOrientation, setLROrientation] = useState<boolean>(props.lrOrientation);
  const [isInteractive, setInteractive] = useState<boolean>(props.isInteractive);
  const [includeHiddenNodes, setIncludeHiddenNotes] = useState<boolean>(false);

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

  const onToggleOrientation = () => {
    const newOrientation = !lrOrientation;
    setLROrientation(newOrientation);
    props.onToggleOrientation?.(newOrientation);
  }

  const onInteractiveChangeHandler = () => {
    const newInteractive = !isInteractive;
    setInteractive(newInteractive);
    props.onInteractiveChange?.(newInteractive);
  }

  const onZoomInHandler = () => {
    props.onZoomIn?.();
  }

  const onZoomOutHandler = () => {
    props.onZoomOut?.();
  }

  const onFitViewHandler = () => {
    props.onFitview?.();
  }

  const onCheckboxChange = (isChecked: boolean) => {
    setIncludeHiddenNotes(isChecked);
  }

  const filterNodeList = (nodes: Elements): INodeListItem[] => {
    const elements: INodeListItem[] = nodes.map((node) => { return { key: node.id, name: node.data.label as string, isHidden: node.isHidden as boolean } });
    const newElements = elements.reduce((filtered: INodeListItem[], item: INodeListItem) => {
      if (item.name.startsWith('_')) {
        if (includeHiddenNodes) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
      return filtered;
    }, []);

    return newElements;
  }

  return (
    <Toolbar>
      <br />
      <ExpandingToolbar
        tooltip="Group nodes"
        icon={
          <Icon style={{ color: "white" }}>
            <GroupIcon />
          </Icon>
        }
        className={styles.buttons}
        selectedTab={selectedTab}
        onSelectTab={(newSelectedTab) => {
          setSelectedTab(newSelectedTab)
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
          <Icon style={{ color: "white" }}>
            <SelectionIcon />
          </Icon>
        }
        className={styles.buttons}
        selectedTab={selectedTab2}
        onSelectTab={(newSelectedTab) => {
          setSelectedTab2(newSelectedTab)
        }}
      >
        <ToolGroup name={"Node List"}>
          <NodeList
            nodes={filterNodeList(props.nodes)}
            onSelectionChange={props.onSelectionChange}
          />
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
              checked={includeHiddenNodes}
              onChange={onCheckboxChange}
            />
          </>
        </ToolGroup>
      </ExpandingToolbar>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Change graph orientation" onClick={onToggleOrientation}>
          <Icon style={{ color: "white" }} size="small">
            {lrOrientation ? <ArrowUpDownIcon /> : <ArrowLeftRightIcon />}
          </Icon>
        </Button>
      </div>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Zoom in graph" onClick={onZoomInHandler}>
          <Icon style={{ color: "white" }} size="small">
            <PlusIcon />
          </Icon>
        </Button>
        <Button className={styles.iconButton} tooltip="Zoom out graph" onClick={onZoomOutHandler}>
          <Icon style={{ color: "white" }} size="small">
            <MinusIcon />
          </Icon>
        </Button>
        <Button className={styles.iconButton} tooltip="Fit graph to window" onClick={onFitViewHandler}>
          <Icon style={{ color: "white" }} size="small">
            <FitviewIcon />
          </Icon>
        </Button>
        <Button className={styles.iconButton} tooltip="Lock/unlock the node positions" onClick={onInteractiveChangeHandler}>
          <Icon style={{ color: "white" }} size="small">
            {isInteractive ? <UnlockIcon /> : <LockIcon />}
          </Icon>
        </Button>
      </div>
    </Toolbar>
  );
};
