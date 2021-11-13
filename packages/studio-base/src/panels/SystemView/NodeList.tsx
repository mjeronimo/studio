import * as React from 'react';
import { Link, useTheme } from "@fluentui/react";
import { Announced } from '@fluentui/react/lib/Announced';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { IRenderFunction } from '@fluentui/utilities';
import { DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { CSSProperties } from 'react';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

const selectNoneStyle: CSSProperties = { paddingLeft: '25px' };

export interface INodeListItem {
  key: number;
  name: string;
}

export interface INodeListState {
  items: INodeListItem[];
  selectionDetails: string;
}

function handleClickOnLink(ev: React.MouseEvent<unknown>) {
  window.alert('clicked on Link component which is rendered as html button');
}

export class NodeList extends React.Component<{}, INodeListState> {
  private _selection: Selection;
  private _allItems: INodeListItem[];
  private _columns: IColumn[];

  constructor(props: {}) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    this._allItems = [];
    for (let i = 0; i < 12; i++) {
      this._allItems.push({
        key: i,
        name: 'Item ' + i,
      });
    }

    this._columns = [
      { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 200, maxWidth: 200, isResizable: true },
    ];

    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
    };
  }

  private onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    return ( 
        <div>
        <Link onClick={handleClickOnLink} underline>Select all</Link>
        <Link onClick={handleClickOnLink} underline style={selectNoneStyle}>Select none</Link>
        <TextField
          className={exampleChildClass}
          label="Filter by name:"
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        </div>
    );
  }

  public override render(): JSX.Element {
    const { items, selectionDetails } = this.state;

    return (
      <div>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            compact={true}
            items={items}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={this._onItemInvoked}
            onRenderDetailsHeader={this.onRenderDetailsHeader}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
          />
        </MarqueeSelection>
      </div>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as INodeListItem).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
    });
  };

  private _onItemInvoked(item: INodeListItem): void {
    alert(`Item invoked: ${item.name}`);
  }
}
