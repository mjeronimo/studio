
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
import React, { useState } from "react";

// Foxglove
import Button from "@foxglove/studio-base/components/Button";
import Checkbox from "@foxglove/studio-base/components/Checkbox";
import ExpandingToolbar, { ToolGroup } from "@foxglove/studio-base/components/ExpandingToolbar";
import FoxgloveIcon from "@foxglove/studio-base/components/Icon";
import SegmentedControl, { Option } from "@foxglove/studio-base/components/SegmentedControl";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

// Reaflow
import { EdgeData } from 'reaflow';

// SystemView
import Toolbar from "./Toolbar";
import { MyNodeData } from "./MyNodeData";
import { NodeList } from "./NodeList";

// MDI icons
import ArrowLeftRightIcon from "@mdi/svg/svg/arrow-left-right.svg";
import ArrowUpDownIcon from "@mdi/svg/svg/arrow-up-down.svg";
import FitToPageIcon from "@mdi/svg/svg/fit-to-page-outline.svg";
import GroupIcon from "@mdi/svg/svg/group.svg";
import Minus from "@mdi/svg/svg/minus.svg";
import Plus from "@mdi/svg/svg/plus.svg";
import SelectionIcon from "@mdi/svg/svg/checkbox-multiple-marked-outline.svg";

export type ToolbarProps = {
  nodes: MyNodeData[]
  edges: EdgeData[]
  lrOrientation: boolean
  zoomIn: () => void
  zoomOut: () => void
  toggleOrientation: () => void
  fitToWindow: () => void
};

export default function SystemViewToolbar(props: ToolbarProps): JSX.Element {

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
  const optionArr: Option[] = Object.values(GroupingOptions);

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
              options={optionArr}
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
          <NodeList nodes={props.nodes} edges={props.edges} />
        </ToolGroup>
        <ToolGroup name={"Node List Options"}>
          <>
            <Checkbox
              label="Include hidden nodes"
              checked={false}
              onChange={() => console.log("onChange")}
            />
            <Checkbox
              label="Automatically display new nodes"
              checked={false}
              onChange={() => console.log("onChange")}
            />
          </>
        </ToolGroup>

      </ExpandingToolbar>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Change graph orientation" onClick={props.toggleOrientation}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            {props.lrOrientation ? <ArrowLeftRightIcon /> : <ArrowUpDownIcon />}
          </FoxgloveIcon>
        </Button>
      </div>
      <div className={styles.buttons}>
        <Button className={styles.iconButton} tooltip="Fit graph to window" onClick={() => {
          props.fitToWindow()
        }
        }>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <FitToPageIcon />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Zoom in" onClick={() => {
          props.zoomIn();
        }
        }>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <Plus />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Zoom out" onClick={() => {
          props.zoomOut();
        }
        }>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <Minus />
          </FoxgloveIcon>
        </Button>
      </div>
    </Toolbar>
  );
}
