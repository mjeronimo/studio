// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import diff from "jest-diff";
import { isEqual } from "lodash";

import {
  mockSendNotification,
  setNotificationHandler,
} from "@foxglove-studio/app/test/MockSendNotification";

// Mock out sendNotification for all tests
jest.mock("@foxglove-studio/app/util/sendNotification", () => {
  return {
    __esModule: true,
    default: mockSendNotification,
    setNotificationHandler,
  };
});

// If sendNotification was called during a test the test must also call expectCalledDuringTest()
// to indicate they expected notifications
afterEach(async () => {
  if (mockSendNotification.mock.calls.length > 0) {
    const calls = mockSendNotification.mock.calls;
    mockSendNotification.mockClear();
    // Reset the error handler to the default (no error handler).
    setNotificationHandler();
    fail(
      `sendNotification has been called during this test (call sendNotification.expectCalledDuringTest(); at the end of your test if you expect this): ${JSON.stringify(
        calls,
      )}`,
    );
  }
});

// We extend the expect global with our matcher.
// This adds the appropriate declaration to the global jest
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toContainOnly(expected: unknown[]): R;
    }
  }
}

// this file runs once jest has injected globals so you can modify the expect matchers
expect.extend({
  // expects an array to contain exactly the other elements
  // in otherArray using isEqual
  toContainOnly(received: unknown, expectedArray: unknown[]) {
    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () => `Received non-array: ${this.utils.printReceived(received)}`,
      };
    }

    const receivedArray = Array.from(received);
    let pass = true;
    if (receivedArray.length !== expectedArray.length) {
      pass = false;
    } else {
      for (const expectedItem of expectedArray) {
        if (!receivedArray.some((receivedItem) => isEqual(receivedItem, expectedItem))) {
          pass = false;
          break;
        }
      }
      for (const receivedItem of receivedArray) {
        if (!expectedArray.some((expectedItem) => isEqual(receivedItem, expectedItem))) {
          pass = false;
          break;
        }
      }
    }
    return {
      pass,
      actual: receivedArray,
      message: () => {
        const diffString = diff(expectedArray, receivedArray, { expand: this.expand });
        return `${this.utils.matcherHint(
          pass ? ".not.toContainOnly" : ".toContainOnly",
        )}\n\nExpected value${pass ? " not" : ""} to contain only:\n  ${this.utils.printExpected(
          expectedArray,
        )}\nReceived:\n  ${this.utils.printReceived(
          receivedArray,
        )}\n\nDifference:\n\n${diffString}`;
      },
    };
  },
});