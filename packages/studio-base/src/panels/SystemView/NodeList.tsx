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

import { DefaultButton, Checkbox } from "@fluentui/react";
import { DetailsList, DetailsRow, IDetailsListProps, IDetailsListCheckboxProps, IDetailsRowStyles, IDetailsHeaderProps, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { IRenderFunction } from '@fluentui/utilities';
import SelectAllIcon from "@mdi/svg/svg/format-list-bulleted-square.svg";
import SelectNoneIcon from "@mdi/svg/svg/format-list-checkbox.svg";
import SearchIcon from "@mdi/svg/svg/magnify.svg";
import { CSSProperties, useState } from 'react';
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
    this._selection.setChangeEvents(false, true);
    for (let i = 0; i < this.props.nodes.length; i++) {
      const key = this.props.nodes[i]!.key;
      const isHidden = this.props.nodes[i]!.isHidden;
      this._selection.setKeySelected(`${key}`, !isHidden, false);
    }
    this._selection.setChangeEvents(true, true);
  }

  // <Icon style={{ color: "white", marginLeft: "5px", display: "inline" }} size="medium"

  private onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, _defaultRender) => {
    if (!props) {
      return ReactNull;
    }

    const selectNoneStyle: CSSProperties = { paddingLeft: '25px' };
    const [_selection, setSelection] = useState(new Selection())

    return (
      <div>
        <div style={{ backgroundColor: "#1A191F", width: "288px", padding: "0", height: "35px", borderRadius: "4px", border: "1px solid white", marginTop: "10px", marginBottom: "5px" }}>
          <Icon size="medium" style={{ marginLeft: "5px", display: "inline" }}>
            <SearchIcon />
          </Icon>
          <LegacyInput
            type="text"
            placeholder="Search for nodes..."
            spellCheck={false}
            style={{ backgroundColor: "transparent", fontSize: '14px', width: "185px", marginLeft: "0px", marginRight: "0px", padding: "8px 5px" }}
            onChange={(e) => {
              const text = e.currentTarget.value;
              this.setState({
                items: text ? this.props.nodes.filter(i => i.name.toLowerCase().includes(text)) : this.props.nodes,
              });
            }}
          />
          <span style={{ color: colors.TEXT_NORMAL, display: "inline", textAlign: "center", marginRight: "5px", marginLeft: "5px" }}>
            101 of 200
          </span>
        </div>

        <Icon
          onClick={
            () => {
              const newSelection = this._selection;
              newSelection.setItems(this.props.nodes);
              this._selection.setChangeEvents(false, true);
              for (let i = 0; i < this.props.nodes.length; i++) {
                const key = this.props.nodes[i]!.key;
                // Avoid updating the graph 'til the last selection change
                if (i === this.props.nodes.length - 1) {
                  this._selection.setChangeEvents(true, true);
                }
                newSelection.setKeySelected(`${key}`, true, false);
              }
              setSelection(newSelection);
            }
          }
        >
          <SelectAllIcon />
        </Icon>

        <Icon
          onClick={
            () => {
              const newSelection = this._selection;
              newSelection.setItems(this.props.nodes);
              setSelection(newSelection);
            }
          }
        >
          <SelectNoneIcon />
        </Icon>

      </div>
    );
  }

  private onRenderCheckbox(props: IDetailsListCheckboxProps | undefined) {
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

    //customStyles.root = { border: '0px solid green', margin: 0, padding: 0 };
    //customStyles.cell = { border: '0px solid white', margin: 0, paddingTop: 14, minHeight: 0, height: rowHeight};
    customStyles.cell = { backgroundColor: "black", opacity: "0.8", border: '0px solid white', paddingTop: 9 };
    customStyles.checkCell = { backgroundColor: "black", opacity: "0.8", border: '0px solid yellow', width: '32px' };
    customStyles.check = { backgroundColor: "black", opacity: "0.8", border: '0px solid orange', width: '32px', maxWidth: '32px' };
    //customStyles.fields = { border: '0px solid red', margin: 0, padding: 0 };

    return <DetailsRow {...props} styles={customStyles} />;
  };

  public override render(): JSX.Element {
    const { items } = this.state;

    return (
      <div>
        <MarqueeSelection selection={this._selection} onShouldStartSelection={(_ev: MouseEvent) => { return false; }} >
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
        </MarqueeSelection>
      </div>
    );
  }
}
