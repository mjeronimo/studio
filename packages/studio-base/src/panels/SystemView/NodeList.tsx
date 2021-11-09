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

import React, { memo } from 'react';

import {
  GroupHeader,
  GroupedList,
  IGroupHeaderCheckboxProps,
  IGroupHeaderProps,
  IGroupRenderProps,
  IGroup,
  IObjectWithKey,
  DetailsRow,
  FocusZone,
  Selection,
  SelectionMode,
  SelectionZone,
  Toggle,
  useTheme
} from "@fluentui/react";

import { useConst } from "@fluentui/react-hooks";
import { getRosNodes, createGroups, IRosNode } from "./listitems";

const NodeList: React.FunctionComponent = () => {

  const theme = useTheme();

  const items: IObjectWithKey[] = useConst(() => getRosNodes());
  const groups = useConst(() => createGroups(items));
  const columns = useConst(() => [{ fieldName: "name", key: "name", minWidth: 300, name: "name" }]);
  const selection = useConst(() => new Selection({ items }));

  const groupProps: IGroupRenderProps = {
    onRenderHeader: (props?: IGroupHeaderProps): JSX.Element => (
      <GroupHeader onRenderGroupHeaderCheckbox={onRenderGroupHeaderCheckbox} {...props} />
    ),
  };

  const onRenderGroupHeaderCheckbox = (props?: IGroupHeaderCheckboxProps) => (
    <Toggle checked={props ? props.checked : undefined} />
  );

  const onRenderCell = React.useCallback(
    (nestingDepth?: number, item?: IRosNode, itemIndex?: number, group?: IGroup): React.ReactNode => (
      <DetailsRow
        columns={columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex!}
        selection={selection}
        selectionMode={SelectionMode.multiple}
        group={group}
        indentWidth={50}
      />
    ),
    [columns, selection],
  );

  return (
    <div>
      <FocusZone>
        <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
          <GroupedList
            items={items}
            onRenderCell={onRenderCell}
            selection={selection}
            selectionMode={SelectionMode.multiple}
            groups={groups}
            groupProps={groupProps}
            compact={true}
            theme={theme}
          />
        </SelectionZone>
      </FocusZone>
    </div>
  );
};

export default memo(NodeList);
