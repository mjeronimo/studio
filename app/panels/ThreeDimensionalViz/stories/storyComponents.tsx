import { $Shape } from "utility-types";

//
//  Copyright (c) 2020-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import { createMemoryHistory } from "history";
import { uniq } from "lodash";
import * as React from "react";
import { Worldview } from "regl-worldview";

import delay from "@foxglove-studio/app/shared/delay";
import { selectAllPanelIds } from "@foxglove-studio/app/actions/mosaic";
import Flex from "@foxglove-studio/app/components/Flex";
import PanelLayout from "@foxglove-studio/app/components/PanelLayout";
import { getGlobalHooks } from "@foxglove-studio/app/loadWebviz";
import GlobalVariableSliderPanel from "@foxglove-studio/app/panels/GlobalVariableSlider";
import ThreeDimensionalViz, {
  ThreeDimensionalVizConfig,
} from "@foxglove-studio/app/panels/ThreeDimensionalViz";
import { Store } from "@foxglove-studio/app/types/Store";
import { Frame, Topic } from "@foxglove-studio/app/players/types";
import createRootReducer from "@foxglove-studio/app/reducers";
import configureStore from "@foxglove-studio/app/store/configureStore";
// @ts-expect-error flow imports have any type
import inScreenshotTests from "@foxglove-studio/app/stories/inScreenshotTests";
// @ts-expect-error flow imports have any type
import PanelSetup from "@foxglove-studio/app/stories/PanelSetup";
// @ts-expect-error flow imports have any type
import PanelSetupWithBag from "@foxglove-studio/app/stories/PanelSetupWithBag";
// @ts-expect-error flow imports have any type
import { ScreenshotSizedContainer } from "@foxglove-studio/app/stories/storyHelpers";
// @ts-expect-error flow imports have any type
import { createRosDatatypesFromFrame } from "@foxglove-studio/app/test/datatypes";
import { objectValues } from "@foxglove-studio/app/util";
import { isBobject, wrapJsObject } from "@foxglove-studio/app/util/binaryObjects";

export type FixtureExampleData = {
  topics: {
    [topicName: string]: Topic;
  };
  frame: Frame;
  globalVariables?: {
    [name: string]: string | number;
  };
};

function bobjectify(fixture: FixtureExampleData): FixtureExampleData {
  const { topics, frame } = fixture;
  const newFrame = {};
  // The topics are sometimes arrays, sometimes objects :-(
  const topicsArray = topics instanceof Array ? topics : objectValues(topics);

  const datatypes = createRosDatatypesFromFrame(topicsArray, frame);
  topicsArray.forEach(({ name: topicName, datatype }) => {
    if (frame[topicName]) {
      (newFrame as any)[topicName] = frame[topicName].map(({ topic, receiveTime, message }) => ({
        topic,
        receiveTime,
        message: !isBobject(message) ? wrapJsObject(datatypes, datatype, message) : message,
      }));
    }
  });
  return { ...fixture, frame: newFrame };
}

type FixtureExampleProps = {
  initialConfig: $Shape<ThreeDimensionalVizConfig>;
  data?: FixtureExampleData;
  loadData?: Promise<FixtureExampleData>;
  futureTime?: boolean;
  onMount?: (arg0: HTMLDivElement | null | undefined, store?: Store) => void;
};

type FixtureExampleState = {
  fixture: any | null | undefined;
  config: $Shape<ThreeDimensionalVizConfig>;
};

export const WorldviewContainer = (props: { children: React.ReactNode }) => {
  return (
    <Worldview {...props} hideDebug={inScreenshotTests()}>
      {props.children}
    </Worldview>
  );
};

export class FixtureExample extends React.Component<FixtureExampleProps, FixtureExampleState> {
  state = { fixture: null, config: this.props.initialConfig };

  componentDidMount() {
    const { data, loadData } = this.props;
    if (data) {
      this.updateState(data);
    }
    if (loadData) {
      loadData.then((loadedData) => {
        this.updateState(loadedData);
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: FixtureExampleProps) {
    if (nextProps.data) {
      this.updateState(nextProps.data);
    }
  }

  updateState = (data: FixtureExampleData) => {
    const { topics, globalVariables } = data;
    this.setState(
      {
        fixture: {
          topics: Object.values(topics),
          globalVariables: globalVariables || { futureTime: 1.5 },
        },
      }, // Delay passing in the frame in order to work around a MessageHistory behavior
      // where the existing frame is not re-processed when the set of topics changes.
      () => {
        // Additional delay to allow the 3D panel's dynamic setSubscriptions to take effect
        // *before* the fixture changes, not in the same update cycle.
        setImmediate(() => {
          this.setState((state) => ({
            fixture: { ...state.fixture, frame: bobjectify(data).frame },
          }));
          // Additional delay to trigger updating available namespaces after consuming
          // the messages in SceneBuilder.
          setImmediate(() => {
            this.setState({});
          });
        });
      },
    );
  };

  render() {
    const { fixture } = this.state;
    if (!fixture) {
      return null;
    }
    return (
      <PanelSetup fixture={fixture} onMount={this.props.onMount}>
        <Flex col>
          <ThreeDimensionalViz
            config={this.state.config as any}
            saveConfig={(config) => this.setState({ config: { ...this.state.config, ...config } })}
          />
          {this.props.futureTime != null && (
            <div style={{ height: "100px" }}>
              <GlobalVariableSliderPanel
                config={{
                  sliderProps: { min: 0, max: 12, step: 0.5 },
                  globalVariableName: "futureTime",
                }}
              />
            </div>
          )}
        </Flex>
      </PanelSetup>
    );
  }
}

export const ThreeDimPanelSetupWithBag = ({
  threeDimensionalConfig,
  globalVariables = {},
  bag,
}: {
  threeDimensionalConfig: $Shape<ThreeDimensionalVizConfig>;
  globalVariables: any;
  bag: string;
}) => {
  const store: Store = configureStore(createRootReducer(createMemoryHistory()));
  const topics = uniq(
    threeDimensionalConfig.checkedKeys
      ?.filter((key) => key.startsWith("t:"))
      .map((topic) => topic.substring(2))
      .concat((getGlobalHooks() as any).perPanelHooks().ThreeDimensionalViz.topics),
  );

  return (
    <ScreenshotSizedContainer>
      <PanelSetupWithBag
        frameHistoryCompatibility
        bag={bag}
        subscriptions={topics}
        store={store}
        onMount={() => {
          setImmediate(async () => {
            await delay(500); // Wait for the panel to finish resizing
            // Select the panel so we can control with the keyboard
            store.dispatch(selectAllPanelIds() as any);
          });
        }}
        getMergedFixture={(bagFixture: any) => ({
          ...bagFixture,
          globalVariables: { ...globalVariables },
          layout: {
            first: "3D Panel!a",
            second: "GlobalVariableSliderPanel!b",
            direction: "column",
            splitPercentage: 92.7860696517413,
          },
          savedProps: {
            "3D Panel!a": threeDimensionalConfig,
            "GlobalVariableSliderPanel!b": {
              sliderProps: {
                min: 0,
                max: 12,
                step: 0.5,
              },
              globalVariableName: "futureTime",
            },
          },
        })}
      >
        <PanelLayout />
      </PanelSetupWithBag>
    </ScreenshotSizedContainer>
  );
};