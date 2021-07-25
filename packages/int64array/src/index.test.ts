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
    ["bigint[]", new I64Array([1n, 2n])],
    ["iterator", new I64Array([1n, 2n].values())],
  ])("can be instantiated with %s", (_name, obj) => {
    expect(obj.byteLength).toBe(2 * 8);
    expect(obj.byteOffset).toBe(0);
    expect(obj[0]).toBe(1n);
    expect(obj[1]).toBe(2n);
    expect(obj[2]).toBeUndefined();
  });
  it.each([
    ["length", new I64Array(2)],
    ["ArrayBuffer", new I64Array(Uint32Array.from([0, 0, 0, 0]).buffer)],
  ])("can be zero-initialized with %s", (_name, obj) => {
    expect(obj.byteLength).toBe(2 * 8);
    expect(obj.byteOffset).toBe(0);
    expect(obj[0]).toBe(0n);
    expect(obj[1]).toBe(0n);
    expect(obj[2]).toBeUndefined();
  });

  it("Symbol.iterator", () => {
    const arr = new I64Array([1n, 2n, 3n]);
    expect([...arr]).toEqual([1n, 2n, 3n]);
  });

  it("at", () => {
    const arr = new I64Array([1n, 2n, 3n]);
    expect(arr.at(-4)).toBe(undefined);
    expect(arr.at(-3)).toBe(1n);
    expect(arr.at(-2)).toBe(2n);
    expect(arr.at(-1)).toBe(3n);
    expect(arr.at(0)).toBe(1n);
    expect(arr.at(1)).toBe(2n);
    expect(arr.at(2)).toBe(3n);
    expect(arr.at(4)).toBe(undefined);
  });

  it("of", () => {
    const arr = I64Array.of(1n, 2n, 3n);
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1n);
    expect(arr[1]).toBe(2n);
    expect(arr[2]).toBe(3n);
  });

  it("from", () => {
    expect(I64Array.from([1n, 2n, 3n] as any)).toEqual(new I64Array([1n, 2n, 3n]));
    expect(I64Array.from([1, 2, 3] as any)).toEqual(new I64Array([1n, 2n, 3n]));
    expect(I64Array.from("123" as any)).toEqual(new I64Array([1n, 2n, 3n]));
  });

  it("copyWithin", () => {});

  it("entries", () => {
    const arr = new I64Array([1n, 2n, 3n]);
    expect([...arr.entries()]).toEqual([
      [0, 1n],
      [1, 2n],
      [2, 3n],
    ]);
  });
  it("every", () => {});
  it("fill", () => {});
  it("filter", () => {});
  it("find", () => {});
  it("findIndex", () => {});
  it("forEach", () => {});
  it("includes", () => {});
  it("indexOf", () => {});
  it("join", () => {});
  it("keys", () => {});
  it("lastIndexOf", () => {});
  it("length", () => {});
  it("map", () => {});
  it("reduce", () => {});
  it("reduceRight", () => {});
  it("reverse", () => {});
  it("set", () => {});
  it("slice", () => {});
  it("some", () => {});
  it("sort", () => {});
  it("subarray", () => {});
  it("toLocaleString", () => {});
  it("toString", () => {});
  it("valueOf", () => {});
  it("values", () => {});
});
