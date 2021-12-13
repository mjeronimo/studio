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

import { storiesOf } from "@storybook/react";
import MockPanelContextProvider from "@foxglove/studio-base/components/MockPanelContextProvider";
import { NodeList } from "./NodeList";
import { initialNodes } from './initial-elements';

const containerStyle = {
  margin: 8,
  display: "inline-block",
};

const NodeListWrapper = (props: any) => (
  <div style={containerStyle}>
    <MockPanelContextProvider>
      <NodeList
        nodes={initialNodes.map((node) => { return { key: node.id, name: node.data.label as string, isHidden: node.isHidden as boolean } })} 
        lrOrientation={true}
      />
    </MockPanelContextProvider>
  </div>
);

storiesOf("panels/SystemView/NodeList", module)
  .add("Default", () => <NodeListWrapper />)
