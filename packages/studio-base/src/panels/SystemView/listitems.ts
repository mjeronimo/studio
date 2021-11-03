import { lorem } from './lorem';

const DATA = {
  color: ['red', 'blue', 'green', 'yellow'],
  shape: ['circle', 'square', 'triangle'],
  location: ['Seattle', 'New York', 'Chicago', 'Los Angeles', 'Portland'],
};

export interface IExampleItem {
  node_name: string;
  thumbnail: string;
  key: string;
  name: string;
  description: string;
  color: string;
  shape: string;
  location: string;
  width: number;
  height: number;
}

export function createListItems(count: number, startIndex: number = 0): IExampleItem[] {
  return [...Array(count)].map((item: number, index: number) => {
    const size = 150 + Math.round(Math.random() * 100);

    return {
      node_name: '/viper/node_name',
      thumbnail: `http://via.placeholder.com/${size}x${size}`,
      key: 'item-' + (index + startIndex) + ' ' + lorem(4),
      name: lorem(5),
      description: lorem(10 + Math.round(Math.random() * 50)),
      color: _randWord(DATA.color),
      shape: _randWord(DATA.shape),
      location: _randWord(DATA.location),
      width: size,
      height: size,
    };
  });
}

export interface IExampleGroup {
  count: number;
  key: string;
  name: string;
  startIndex: number;
  level?: number;
  isCollapsed?: boolean;
  children?: IExampleGroup[];
}

export function createGroups(
  groupCount: number,
  groupDepth: number,
  startIndex: number,
  itemsPerGroup: number,
  level: number = 0,
  key: string = '',
  isCollapsed?: boolean,
): IExampleGroup[] {
  if (key !== '') {
    key = key + '-';
  }
  const count = Math.pow(itemsPerGroup, groupDepth);
  return [...Array(groupCount)].map((value: number, index: number) => {
    return {
      count: count,
      key: 'Host' + key + index,
      name: 'Host ' + key + index,
      startIndex: index * count + startIndex,
      level: level,
      isCollapsed: isCollapsed,
      children:
        groupDepth > 1
          ? createGroups(groupCount, groupDepth - 1, index * count + startIndex, itemsPerGroup, level + 1, key + index)
          : [],
    };
  });
}

function _randWord(array: string[]): string {
  const index = Math.floor(Math.random() * array.length);
  var str = array[index];
  if (str) {
    return str;
  }

  return "";
}
