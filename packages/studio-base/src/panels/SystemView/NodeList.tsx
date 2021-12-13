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
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { IRenderFunction } from '@fluentui/utilities';
import SelectAllIcon from "@mdi/svg/svg/format-list-bulleted-square.svg";
import SelectNoneIcon from "@mdi/svg/svg/format-list-checkbox.svg";
import { CSSProperties, useEffect, useState } from 'react';
import * as React from 'react';

import Icon from "@foxglove/studio-base/components/Icon";

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };
const selectNoneStyle: CSSProperties = { paddingLeft: '25px' };

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

  public override componentDidMount() {
    this._selection.setChangeEvents(false, true);
    for (let i = 0; i < this.props.nodes.length; i++) {
      const key = this.props.nodes[i]!.key;
      const isHidden = this.props.nodes[i]!.isHidden;
      this._selection.setKeySelected(`${key}`, !isHidden, false);
    }
    this._selection.setChangeEvents(true, true);
  }

  private onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    const [selection, setSelection] = useState(new Selection())
    useEffect(() => { setSelection(new Selection()) }, [])

    return (
      <div>
        <TextField
          className={exampleChildClass}
          label="Filter by name:"
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        <br />

        <DefaultButton text="Select All"
          styles={{
            flexContainer: {
              flexDirection: 'row-reverse'
            }
          }}
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
          <Icon style={{ color: "white" }} size="medium">
            <SelectAllIcon />
          </Icon>
        </DefaultButton>

        <span style={selectNoneStyle}>
          <DefaultButton text="Select None"
            styles={{
              flexContainer: {
                flexDirection: 'row-reverse',
              }
            }}
            onClick={
              () => {
                const newSelection = this._selection;
                newSelection.setItems(this.props.nodes);
                setSelection(newSelection);
              }
            }
          >
            <Icon style={{ color: "white" }} size="medium">
              <SelectNoneIcon />
            </Icon>
          </DefaultButton>
        </span>
        <br />
        <br />
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
      return null;
    }

    const customStyles: Partial<IDetailsRowStyles> = {
    };

    //customStyles.root = { border: '0px solid green', margin: 0, padding: 0 };
    //customStyles.cell = { border: '0px solid white', margin: 0, paddingTop: 14, minHeight: 0, height: rowHeight};
    customStyles.cell = { border: '0px solid white', paddingTop: 9 };
    customStyles.checkCell = { border: '0px solid yellow', width: '32px' };
    customStyles.check = { border: '0px solid orange', width: '32px', maxWidth: '32px' };
    //customStyles.fields = { border: '0px solid red', margin: 0, padding: 0 };

    return <DetailsRow {...props} styles={customStyles} />;
  };

  public override render(): JSX.Element {
    const { items } = this.state;

    return (
      <div>
        <MarqueeSelection selection={this._selection} onShouldStartSelection={(ev: MouseEvent) => { return false; }} >
          <DetailsList
            compact={true}
            items={items}
            columns={this._columns}
            setKey="set"
            //layoutMode={DetailsListLayoutMode.justified}
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

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    this.setState({
      items: text ? this.props.nodes.filter(i => i.name.toLowerCase().includes(text)) : this.props.nodes,
    });
  };
}
