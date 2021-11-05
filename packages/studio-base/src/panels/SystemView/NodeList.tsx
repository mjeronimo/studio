
import React, { memo } from 'react';
import { GroupHeader, GroupedList, IGroupHeaderCheckboxProps, IGroupHeaderProps, IGroupRenderProps, IGroup, IColumn, IObjectWithKey, DetailsRow, FocusZone, Selection, SelectionMode, SelectionZone, Toggle, ThemeProvider } from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import { ws_connect, ws_disconnect, ws_send } from "./wsclient"

import { getRosNodes, createGroups, IRosNode } from "./listitems";

const groupProps: IGroupRenderProps = {
  onRenderHeader: (props?: IGroupHeaderProps): JSX.Element => (
    <GroupHeader onRenderGroupHeaderCheckbox={onRenderGroupHeaderCheckbox} {...props} />
  ),
};

const onRenderGroupHeaderCheckbox = (props?: IGroupHeaderCheckboxProps) => (
  <Toggle checked={props ? props.checked : undefined} />
);

const NodeList: React.FunctionComponent = () => {

  /////
  const items: IObjectWithKey[] = useConst(() => getRosNodes());
  const groups = useConst(() => createGroups());
  const columns = useConst(() =>
    [{fieldName: "name", key: "name", minWidth: 300, name: "name"} ]
  );
  /////

  const selection = useConst(() => new Selection({ items }));

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
          />
        </SelectionZone>
      </FocusZone>
    </div>
  );
};

export default memo(NodeList);
