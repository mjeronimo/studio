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

import { Checkbox } from "@fluentui/react";
import { DetailsList, DetailsRow, IDetailsListProps, IDetailsListCheckboxProps, IDetailsRowStyles, IDetailsHeaderProps, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { IRenderFunction } from '@fluentui/utilities';
import SelectAllIcon from "@mdi/svg/svg/format-list-bulleted-square.svg";
import SelectNoneIcon from "@mdi/svg/svg/format-list-checkbox.svg";
import SearchIcon from "@mdi/svg/svg/magnify.svg";
import * as React from 'react';

import Icon from "@foxglove/studio-base/components/Icon";
import { LegacyInput } from "@foxglove/studio-base/components/LegacyStyledComponents";
import { colors } from "@foxglove/studio-base/util/sharedStyleConstants";

export interface INodeListItem {
  key: string;
  name: string;
  isHidden: boolean;
}

export interface INodeListState {
  items: INodeListItem[];
}

interface Props {
  nodes: INodeListItem[]
  onSelectionChange: (selectedNodes: string[]) => void
}

export class NodeList extends React.Component<Props, INodeListState> {
  private _selection: Selection;
  private _columns: IColumn[];

  constructor(props: Props) {
    super(props);
    this._selection = new Selection({
      onSelectionChanged: () => {
        const items = this._selection.getItems();
        const selectedItems = this._selection.getSelectedIndices();
        const selectedNames: string[] = selectedItems.map((item) => {
          return (items[+item] as INodeListItem).name;
        });
        props.onSelectionChange(selectedNames);
      }
    });

    this._columns = [
      { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 250, maxWidth: 250, isResizable: true },
    ];

    this.state = {
      items: props.nodes
    };
  }

  public override componentDidMount(): void {
    this._selection.setChangeEvents(false);
    this.props.nodes.forEach(node => {
      this._selection.setKeySelected(`${node.key}`, !node.isHidden, false);
    });
    this._selection.setChangeEvents(true);
  }

  private onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, _defaultRender) => {
    if (!props) {
      return ReactNull;
    }

    return (
      <div>
        <div style={{ backgroundColor: "#1A191F", width: "300px", padding: "0", height: "35px", borderRadius: "4px", border: "1px solid white", marginTop: "10px", marginBottom: "5px" }}>
          <Icon size="medium" style={{ marginLeft: "5px", display: "inline" }}>
            <SearchIcon />
          </Icon>
          <LegacyInput
            type="text"
            placeholder="Filter nodes..."
            //value={this.state["filterText"]}
            spellCheck={false}
            style={{ backgroundColor: "transparent", fontSize: '14px', width: "195px", marginLeft: "0px", marginRight: "0px", padding: "8px 5px" }}
            onChange={(e) => {
              const text = e.currentTarget.value;
              const filteredNodes = text ? this.props.nodes.filter(node => node.name.toLowerCase().includes(text)) : this.props.nodes;
              this.setState({ items: filteredNodes });
            }}
          />
          <span style={{ color: colors.TEXT_NORMAL, display: "inline", textAlign: "center", marginRight: "5px", marginLeft: "5px" }}>
            {this.state["items"].length} of {this.props.nodes.length}
          </span>
        </div>

        <Icon
          onClick={
            () => {
              this._selection.setChangeEvents(false);
              this.state["items"].forEach((item) => {
                this._selection.setKeySelected(item.key, true, false);
              });
              this._selection.setChangeEvents(true);
            }
          }
        >
          <SelectAllIcon />
        </Icon>

        <Icon
          onClick={
            () => {
              this._selection.setChangeEvents(false);
              this.state["items"].forEach((item) => {
                this._selection.setKeySelected(item.key, false, false);
              });
              this._selection.setChangeEvents(true);
            }
          }
        >
          <SelectNoneIcon />
        </Icon>
      </div>
    );
  }

  private onRenderCheckbox: IRenderFunction<IDetailsListCheckboxProps> = (props) => {
    const styles = {
      checkbox: {
        width: '15px',
        height: '15px',
      }
    };
    return (
      <div style={{ pointerEvents: 'none' }}>
        <Checkbox checked={props!.checked} styles={styles} />
      </div>
    );
  }

  private onRenderRow: IDetailsListProps['onRenderRow'] = props => {
    if (!props) {
      return ReactNull;
    }

    const customStyles: Partial<IDetailsRowStyles> = {
    };

    customStyles.cell = { backgroundColor: "black", opacity: "0.8", border: '0px solid white', paddingTop: 9 };
    customStyles.checkCell = { backgroundColor: "black", opacity: "0.8", border: '0px solid yellow', width: '32px' };
    customStyles.check = { backgroundColor: "black", opacity: "0.8", border: '0px solid orange', width: '32px', maxWidth: '32px' };

    return <DetailsRow {...props} styles={customStyles} />;
  };

  public override render(): JSX.Element {
    const { items } = this.state;

    return (
      <div>
        <DetailsList
          compact={true}
          items={items}
          columns={this._columns}
          setKey="set"
          cellStyleProps={{
            cellLeftPadding: 0,
            cellRightPadding: 5,
            cellExtraRightPadding: 0,
          }}
          selection={this._selection}
          selectionPreservedOnEmptyClick={true}
          onRenderDetailsHeader={this.onRenderDetailsHeader}
          onRenderRow={this.onRenderRow}
          onRenderCheckbox={this.onRenderCheckbox}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      </div>
    );
  }
}
