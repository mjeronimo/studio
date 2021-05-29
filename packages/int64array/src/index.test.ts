// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { I64Array } from ".";

describe("BigInt64Array", () => {
  it.each([
    ["no args", new I64Array()],
    ["0", new I64Array(0)],
    ["[]", new I64Array([])],
    ["empty iterator", new I64Array([].values())],
    ["empty ArrayBuffer", new I64Array(new ArrayBuffer(0))],
  ])("can be instantiated empty with %s", (_name, obj) => {
    expect(obj.byteLength).toBe(0);
    expect(obj.byteOffset).toBe(0);
    expect(obj[0]).toBeUndefined();
  });

  it.each([
    // ["length", new I64Array(2)],
    ["bigint[]", new I64Array([1n, 2n])],
    ["iterator", new I64Array([1n, 2n].values())],
    // ["ArrayBuffer", new I64Array(new ArrayBuffer(0))],
  ])("can be instantiated with %s", (_name, obj) => {
    expect(obj.byteLength).toBe(2 * 8);
    expect(obj.byteOffset).toBe(0);
    expect(obj[0]).toBe(1n);
    expect(obj[1]).toBe(2n);
    expect(obj[2]).toBeUndefined();
  });
});
