
import React, { memo } from 'react';

import { GroupHeader, GroupedList, IGroupHeaderCheckboxProps, IGroupHeaderProps, IGroupRenderProps, IGroup, IColumn, IObjectWithKey, DetailsRow, FocusZone, Selection, SelectionMode, SelectionZone, Toggle, ThemeProvider } from "@fluentui/react";

import { useConst } from "@fluentui/react-hooks";

import { createListItems, createGroups, IExampleItem } from "./listitems";

// import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
// import { initializeIcons } from "@uifabric/icons";
// initializeIcons();

import { ws_connect, ws_disconnect, ws_send } from "./wsclient"

const groupProps: IGroupRenderProps = {
  onRenderHeader: (props?: IGroupHeaderProps): JSX.Element => (
    <GroupHeader onRenderGroupHeaderCheckbox={onRenderGroupHeaderCheckbox} {...props} />
  ),
};

const onRenderGroupHeaderCheckbox = (props?: IGroupHeaderCheckboxProps) => (
  <Toggle checked={props ? props.checked : undefined} />
);

const groupCount = 2;
const groupDepth = 2;

const NodeList: React.FunctionComponent = () => {
  const items: IObjectWithKey[] = useConst(() => createListItems(Math.pow(groupCount, groupDepth + 1)));
  const groups = useConst(() => createGroups(groupCount, groupDepth, 0, groupCount));
  const columns = useConst(() =>
    Object.keys(items[0]!)
      .slice(0, 3)
      .map(
        (key: string): IColumn => ({
          key: key,
          name: key,
          fieldName: key,
          minWidth: 300,
        }),
      ),
  );
  const selection = useConst(() => new Selection({ items }));

  const onRenderCell = React.useCallback(
    (nestingDepth?: number, item?: IExampleItem, itemIndex?: number, group?: IGroup): React.ReactNode => (
      <DetailsRow
        columns={columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex!}
        selection={selection}
        selectionMode={SelectionMode.multiple}
        group={group}
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
          />
        </SelectionZone>
      </FocusZone>
    </div>
  );
};

export default memo(NodeList);
