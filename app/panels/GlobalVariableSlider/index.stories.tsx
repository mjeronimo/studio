//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import { storiesOf } from "@storybook/react";
import React from "react";
import TestUtils from "react-dom/test-utils";

import GlobalVariableSliderPanel from "@foxglove-studio/app/panels/GlobalVariableSlider/index";
// @ts-expect-error flow imports have any type
import PanelSetup from "@foxglove-studio/app/stories/PanelSetup";

const fixture = {
  topics: [],
  datatypes: {
    Foo: { fields: [] },
  },
  frame: {},
  capabilities: [],
  globalVariables: { globalVariable: 3.5 },
};

storiesOf("<GlobalVariableSliderPanel>", module)
  .add("example", () => {
    return (
      <PanelSetup fixture={fixture}>
        <GlobalVariableSliderPanel />
      </PanelSetup>
    );
  })
  .add("labels do not overlap when panel narrow", () => {
    return (
      <PanelSetup fixture={fixture}>
        <div style={{ width: 400 }}>
          <GlobalVariableSliderPanel />
        </div>
      </PanelSetup>
    );
  })
  .add("menu", () => {
    return (
      <PanelSetup fixture={fixture}>
        <GlobalVariableSliderPanel
          // @ts-expect-error add ref to slider panel?
          ref={() => {
            setTimeout(() => {
              const mouseEnterContainer = document.querySelectorAll(
                "[data-test~=panel-mouseenter-container",
              )[0];
              TestUtils.Simulate.mouseEnter(mouseEnterContainer);
              (document.querySelectorAll("[data-test=panel-settings]")[0] as any).click();
            }, 50);
          }}
        />
      </PanelSetup>
    );
  });