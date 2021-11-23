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

import { Elements, Position, XYPosition, ArrowHeadType } from 'react-flow-renderer';

const position: XYPosition = { x: 0, y: 0 };

const initialElements: Elements = [
  {
    id: '1',
    isHidden: false,
    type: 'input',
    data: { label: 'input' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '2',
    isHidden: false,
    data: { label: 'node 2' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '2a',
    isHidden: false,
    data: { label: 'node 2a' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '2b',
    isHidden: false,
    data: { label: 'node 2b' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '2c',
    isHidden: false,
    data: { label: 'node 2c' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '2d',
    isHidden: false,
    data: { label: 'node 2d' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '3',
    isHidden: false,
    data: { label: 'node 3' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '4',
    isHidden: false,
    data: { label: 'node 4' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '5',
    isHidden: false,
    data: { label: 'node 5' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '6',
    isHidden: false,
    type: 'output',
    data: { label: 'output' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },
  {
    id: '7',
    isHidden: false,
    type: 'output',
    data: { label: 'output' },
    position,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { width: 175, height: 40 },
  },

  // Edges
  { 
    id: 'e12', 
    isHidden: false,
    label: '10Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '1', 
    target: '2', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e13', 
    isHidden: false,
    label: '11Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '1', 
    target: '3', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e22a', 
    isHidden: false,
    label: '12Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '2', 
    target: '2a', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e22b', 
    isHidden: false,
    label: '13Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '2', 
    target: '2b', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e22c', 
    isHidden: false,
    label: '14Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '2', 
    target: '2c', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e2c2d', 
    isHidden: false,
    label: '15Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '2c', 
    target: '2d', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e45', 
    isHidden: false,
    label: '16Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '4', 
    target: '5', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e56', 
    isHidden: false,
    label: '17Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '5', 
    target: '6', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
  { 
    id: 'e57', 
    isHidden: false,
    label: '18Hz', 
    labelStyle: { fill: 'white' }, 
    labelBgStyle: { fill: 'rgba(0,0,0,0)' },
    source: '5', 
    target: '7', 
    type: 'smoothstep', 
    animated: true, 
    arrowHeadType: ArrowHeadType.Arrow 
  },
];

export default initialElements;
