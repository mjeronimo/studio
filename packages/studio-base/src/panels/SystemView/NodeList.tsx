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
import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';

// Fluent UI
import { DefaultButton } from "@fluentui/react";
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { IRenderFunction } from '@fluentui/utilities';
import { DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';

// Foxglove Studio
import Icon from "@foxglove/studio-base/components/Icon";

// MDI Icons
import SelectAllIcon from "@mdi/svg/svg/format-list-bulleted-square.svg";
import SelectNoneIcon from "@mdi/svg/svg/format-list-checkbox.svg";

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
  lrOrientation: boolean
  onSelectionChange: (selectedNodes: string[]) => void
}

export class NodeList extends React.Component<Props, INodeListState> {
  private _selection: Selection;
  private _columns: IColumn[];

  constructor(props: Props) {
    super(props);

    this._selection = new Selection( {

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
      { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 200, maxWidth: 200, isResizable: true },
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
                if (i == this.props.nodes.length-1) {
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

  public override render(): JSX.Element {
    const { items } = this.state;

    return (
      <div>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            compact={false}
            items={items}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            onRenderDetailsHeader={this.onRenderDetailsHeader}
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
      items: text ? this.props.nodes.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this.props.nodes,
    });
  };
}
