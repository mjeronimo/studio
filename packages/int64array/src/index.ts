// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

function isIterable<T>(value: Iterable<T> | ArrayBufferLike): value is Iterable<T> {
  return typeof (value as { [Symbol.iterator]: unknown })[Symbol.iterator] === "function";
}
/*typeof BigInt64Array !== "undefined"
    ? BigInt64Array
    : */
export class I64Array {
  static BYTES_PER_ELEMENT = 8;
  byteLength: number;
  byteOffset: number;

  // Symbol.species?

  // eslint-disable-next-line no-restricted-syntax
  get [Symbol.toStringTag](): "BigInt64Array" {
    return "BigInt64Array";
  }

  [index: number]: bigint;

  buffer: ArrayBufferLike;
  private dataView: DataView;
  constructor(array: Iterable<bigint>);
  constructor(buffer: ArrayBufferLike, byteOffset?: number, length?: number);
  constructor(length?: number);
  constructor(
    arg: Iterable<bigint> | ArrayBufferLike | number | undefined,
    byteOffset?: number,
    maybeLength?: number,
  ) {
    if (typeof arg === "undefined") {
      this.buffer = new ArrayBuffer(0);
      this.byteLength = 0;
      this.byteOffset = 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    } else if (typeof arg === "number") {
      this.buffer = new ArrayBuffer(arg * I64Array.BYTES_PER_ELEMENT);
      this.byteLength = this.buffer.byteLength;
      this.byteOffset = 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    } else if (isIterable(arg)) {
      const values = [...arg];
      this.buffer = new ArrayBuffer(values.length * I64Array.BYTES_PER_ELEMENT);
      this.byteLength = this.buffer.byteLength;
      this.byteOffset = 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
      for (let i = 0; i < values.length; i++) {
        const value = values[i]!;
        this.setOne(i, value);
      }
    } else {
      this.buffer = arg;
      this.byteLength =
        maybeLength != undefined ? maybeLength * I64Array.BYTES_PER_ELEMENT : arg.byteLength;
      this.byteOffset = byteOffset ?? 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    }
    if (this.byteLength % I64Array.BYTES_PER_ELEMENT !== 0) {
      throw new Error(
        `byte length of ${I64Array.name} should be a multiple of ${I64Array.BYTES_PER_ELEMENT}`,
      );
    }
    if (this.byteOffset % I64Array.BYTES_PER_ELEMENT !== 0) {
      throw new Error(
        `start offset of ${I64Array.name} should be a multiple of ${I64Array.BYTES_PER_ELEMENT}`,
      );
    }
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "string" && prop.length > 0) {
          const idx = +prop;
          if (Number.isFinite(idx)) {
            return idx > 0 ? target.at(idx) : undefined;
          }
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value) {
        if (typeof prop === "string" && prop.length > 0) {
          const idx = +prop;
          if (Number.isFinite(idx)) {
            target.setOne(idx, value);
            return true;
          }
        }
        return Reflect.set(target, prop, value);
      },
    });
  }

  private setOne(index: number, value: bigint): void {
    if (index < 0 || index >= this.length) {
      return;
    }
    this.dataView.setUint32(index * I64Array.BYTES_PER_ELEMENT, Number(value & 0xffffffffn));
    this.dataView.setUint32(
      index * I64Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT,
      Number((value >> 32n) & 0xffffffffn),
    );
  }

  *[Symbol.iterator](): IterableIterator<bigint> {
    for (let idx = 0; idx < this.byteLength; idx += I64Array.BYTES_PER_ELEMENT) {
      const lo = this.dataView.getUint32(idx);
      const hi = this.dataView.getUint32(idx + Uint32Array.BYTES_PER_ELEMENT);
      yield (BigInt(hi) << 32n) | BigInt(lo);
    }
  }

  at(idx: number): bigint | undefined {
    if (idx < 0) {
      // eslint-disable-next-line no-param-reassign
      idx = this.length + idx;
    }
    if (idx < 0 || idx >= this.length) {
      return undefined;
    }
    const lo = this.dataView.getUint32(idx * I64Array.BYTES_PER_ELEMENT);
    const hi = this.dataView.getUint32(
      idx * I64Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT,
    );
    return (BigInt(hi) << 32n) | BigInt(lo);
  }

  static of(...items: bigint[]): I64Array {
    return this.from(items);
  }
  static from(arrayLike: ArrayLike<bigint>): I64Array;
  static from<U>(
    arrayLike: ArrayLike<U>,
    mapfn: (v: U, k: number) => bigint,
    thisArg?: unknown,
  ): I64Array;
  static from<U>(
    arrayLike: ArrayLike<U> | ArrayLike<bigint>,
    mapfn?: (v: U, k: number) => bigint,
    thisArg?: unknown,
  ): I64Array {
    const result = new this(arrayLike.length);
    if (mapfn) {
      for (let i = 0; i < arrayLike.length; i++) {
        result.setOne(i, mapfn.call(thisArg, arrayLike[i]! as U, i));
      }
    } else {
      for (let i = 0; i < arrayLike.length; i++) {
        result.setOne(i, BigInt(arrayLike[i]! as Parameters<BigIntConstructor>[0]));
      }
    }
    return result;
  }

  /**
   * Returns the this object after copying a section of the array identified by start and end
   * to the same array starting at position target
   * @param target If target is negative, it is treated as length+target where length is the
   * length of the array.
   * @param start If start is negative, it is treated as length+start. If end is negative, it
   * is treated as length+end.
   * @param end If not specified, length of the this object is used as its default value.
   */
  copyWithin(target: number, start: number, end?: number): this {
    new Uint32Array(this.buffer).copyWithin(
      target * 2,
      start * 2,
      end != undefined ? end * 2 : undefined,
    );
    return this;
  }

  /** Yields index, value pairs for every entry in the array. */
  *entries(): IterableIterator<[number, bigint]> {
    let index = 0;
    for (const value of this) {
      yield [index++, value];
    }
  }

  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns false,
   * or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every(
    predicate: (value: bigint, index: number, array: this) => boolean,
    thisArg?: unknown,
  ): boolean {
    let index = 0;
    for (const value of this) {
      if (!predicate.call(thisArg, value, index++, this)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the this object after filling the section identified by start and end with value
   * @param value value to fill array section with
   * @param start index to start filling the array at. If start is negative, it is treated as
   * length+start where length is the length of the array.
   * @param end index to stop filling the array at. If end is negative, it is treated as
   * length+end.
   */
  fill(value: bigint, start: number = 0, end: number = this.length): this {
    if (start < 0) {
      // eslint-disable-next-line no-param-reassign
      start = this.length + start;
    }
    if (end < 0) {
      // eslint-disable-next-line no-param-reassign
      end = this.length + end;
    }
    for (let index = start; index < end; index++) {
      this.setOne(index, value);
    }
    return this;
  }

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls
   * the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  filter(
    predicate: (value: bigint, index: number, array: this) => unknown,
    thisArg?: unknown,
  ): I64Array {
    return new I64Array(
      (function* (self) {
        let index = 0;
        for (const value of self) {
          if (predicate.call(thisArg, value, index++, self)) {
            yield value;
          }
        }
      })(this),
    );
  }

  /**
   * Returns the value of the first element in the array where predicate is true, and undefined
   * otherwise.
   * @param predicate find calls predicate once for each element of the array, in ascending
   * order, until it finds one where predicate returns true. If such an element is found, find
   * immediately returns that element value. Otherwise, find returns undefined.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * predicate. If it is not provided, undefined is used instead.
   */
  find(
    predicate: (value: bigint, index: number, array: this) => boolean,
    thisArg?: unknown,
  ): bigint | undefined {
    let index = 0;
    for (const value of this) {
      if (predicate.call(thisArg, value, index++, this)) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Returns the index of the first element in the array where predicate is true, and -1
   * otherwise.
   * @param predicate find calls predicate once for each element of the array, in ascending
   * order, until it finds one where predicate returns true. If such an element is found,
   * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * predicate. If it is not provided, undefined is used instead.
   */
  findIndex(
    predicate: (value: bigint, index: number, array: this) => boolean,
    thisArg?: unknown,
  ): number {
    let index = 0;
    for (const value of this) {
      if (predicate.call(thisArg, value, index++, this)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn A function that accepts up to three arguments. forEach calls the
   * callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  forEach(
    callbackfn: (value: bigint, index: number, array: this) => void,
    thisArg?: unknown,
  ): void {
    let index = 0;
    for (const value of this) {
      callbackfn.call(thisArg, value, index++, this);
    }
  }

  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: bigint, fromIndex: number = 0): boolean {
    for (
      let idx = fromIndex * I64Array.BYTES_PER_ELEMENT;
      idx < this.byteLength;
      idx += I64Array.BYTES_PER_ELEMENT
    ) {
      const lo = this.dataView.getUint32(idx);
      const hi = this.dataView.getUint32(idx + Uint32Array.BYTES_PER_ELEMENT);
      if (searchElement === ((BigInt(hi) << 32n) | BigInt(lo))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the index of the first occurrence of a value in an array.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
   * search starts at index 0.
   */
  indexOf(searchElement: bigint, fromIndex: number = 0): number {
    for (
      let idx = fromIndex * I64Array.BYTES_PER_ELEMENT;
      idx < this.byteLength;
      idx += I64Array.BYTES_PER_ELEMENT
    ) {
      const lo = this.dataView.getUint32(idx);
      const hi = this.dataView.getUint32(idx + Uint32Array.BYTES_PER_ELEMENT);
      if (searchElement === ((BigInt(hi) << 32n) | BigInt(lo))) {
        return idx / I64Array.BYTES_PER_ELEMENT;
      }
    }
    return -1;
  }

  /**
   * Adds all the elements of an array separated by the specified separator string.
   * @param separator A string used to separate one element of an array from the next in the
   * resulting String. If omitted, the array elements are separated with a comma.
   */
  join(separator: string = ","): string {
    let result = "";
    let first = true;
    for (const value of this) {
      if (!first) {
        result += separator;
      }
      first = false;
      result += value.toString();
    }
    return result;
  }

  /** Yields each index in the array. */
  *keys(): IterableIterator<number> {
    const length = this.length;
    for (let index = 0; index < length; index++) {
      yield index;
    }
  }

  /**
   * Returns the index of the last occurrence of a value in an array.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
   * search starts at index 0.
   */
  lastIndexOf(searchElement: bigint, fromIndex: number = this.length - 1): number {
    for (
      let idx = fromIndex * I64Array.BYTES_PER_ELEMENT;
      idx >= 0;
      idx -= I64Array.BYTES_PER_ELEMENT
    ) {
      const lo = this.dataView.getUint32(idx);
      const hi = this.dataView.getUint32(idx + Uint32Array.BYTES_PER_ELEMENT);
      if (searchElement === ((BigInt(hi) << 32n) | BigInt(lo))) {
        return idx / I64Array.BYTES_PER_ELEMENT;
      }
    }
    return -1;
  }

  /** The length of the array. */
  // eslint-disable-next-line no-restricted-syntax
  get length(): number {
    return this.byteLength / I64Array.BYTES_PER_ELEMENT;
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that
   * contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the
   * callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  map(
    callbackfn: (value: bigint, index: number, array: I64Array) => bigint,
    thisArg?: unknown,
  ): I64Array {
    return new I64Array(
      (function* (self) {
        let index = 0;
        for (const value of self) {
          yield callbackfn.call(thisArg, value, index++, self);
        }
      })(this),
    );
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of
   * the callback function is the accumulated result, and is provided as an argument in the next
   * call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
   * callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start
   * the accumulation. The first call to the callbackfn function provides this value as an argument
   * instead of an array value.
   */
  reduce(
    callbackfn: (
      previousValue: bigint,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => bigint,
  ): bigint;
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => U,
    initialValue: U,
  ): U;
  reduce<U>(
    callbackfn: (
      previousValue: U | bigint,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => U | bigint,
    initialValue: U | bigint = 0n,
  ): U | bigint {
    let result = initialValue;
    let index = 0;
    for (const value of this) {
      result = callbackfn(result, value, index++, this);
    }
    return result;
  }

  /**
   * Calls the specified callback function for all the elements in an array, in descending order.
   * The return value of the callback function is the accumulated result, and is provided as an
   * argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
   * the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start
   * the accumulation. The first call to the callbackfn function provides this value as an
   * argument instead of an array value.
   */
  reduceRight(
    callbackfn: (
      previousValue: bigint,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => bigint,
  ): bigint;
  reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => U,
    initialValue: U,
  ): U;
  reduceRight<U>(
    callbackfn: (
      previousValue: U | bigint,
      currentValue: bigint,
      currentIndex: number,
      array: I64Array,
    ) => U | bigint,
    initialValue: U | bigint = 0n,
  ): U | bigint {
    let result = initialValue;
    for (
      let idx = (this.length - 1) * I64Array.BYTES_PER_ELEMENT;
      idx >= 0;
      idx -= I64Array.BYTES_PER_ELEMENT
    ) {
      const lo = this.dataView.getUint32(idx);
      const hi = this.dataView.getUint32(idx + Uint32Array.BYTES_PER_ELEMENT);
      const value = (BigInt(hi) << 32n) | BigInt(lo);
      result = callbackfn(result, value, idx / I64Array.BYTES_PER_ELEMENT, this);
    }
    return result;
  }

  /** Reverses the elements in the array. */
  reverse(): this {
    for (
      let i = 0, j = this.length - 1;
      i < j;
      i += I64Array.BYTES_PER_ELEMENT, j -= I64Array.BYTES_PER_ELEMENT
    ) {
      const lo = this.dataView.getUint32(j);
      const hi = this.dataView.getUint32(j + Uint32Array.BYTES_PER_ELEMENT);
      this.dataView.setUint32(j, this.dataView.getUint32(i));
      this.dataView.setUint32(j + 1, this.dataView.getUint32(i + 1));
      this.dataView.setUint32(i, lo);
      this.dataView.setUint32(i + 1, hi);
    }
    return this;
  }

  /**
   * Sets a value or an array of values.
   * @param array A typed or untyped array of values to set.
   * @param offset The index in the current array at which the values are to be written.
   */
  set(array: ArrayLike<bigint>, offset: number = 0): void {
    for (let i = 0; i < array.length; i++) {
      this.setOne(offset, array[i]!);
    }
  }

  /**
   * Returns a section of an array.
   * @param start The beginning of the specified portion of the array.
   * @param end The end of the specified portion of the array.
   */
  slice(start: number = 0, end: number = this.length): I64Array {
    return new I64Array(
      new Uint32Array(this.buffer, this.byteOffset, this.length * 2).slice(
        start * 2,
        end * 2,
      ).buffer,
    );
  }

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls the
   * predicate function for each element in the array until the predicate returns true, or until
   * the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some(
    predicate: (value: bigint, index: number, array: this) => boolean,
    thisArg?: unknown,
  ): boolean {
    return this.findIndex(predicate, thisArg) !== -1;
  }

  //FIXME
  //   /**
  //    * Sorts the array.
  //    * @param compareFn The function used to determine the order of the elements. If omitted, the elements are sorted in ascending order.
  //    */
  //   sort(compareFn?: (a: bigint, b: bigint) => number | bigint): this;

  /**
   * Gets a new BigInt64Array view of the ArrayBuffer store for this array, referencing the elements
   * at begin, inclusive, up to end, exclusive.
   * @param begin The index of the beginning of the array.
   * @param end The index of the end of the array.
   */
  subarray(begin: number = 0, end: number = this.length): I64Array {
    return new I64Array(
      this.buffer,
      this.byteOffset + begin * I64Array.BYTES_PER_ELEMENT,
      end - begin,
    );
  }

  /** Converts the array to a string by using the current locale. */
  toLocaleString(...args: unknown[]): string {
    let result = "";
    let first = true;
    for (const value of this) {
      if (!first) {
        result += ",";
      }
      first = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result += value.toLocaleString(...(args as any));
    }
    return result;
  }

  /** Returns a string representation of the array. */
  toString(): string {
    return this.join();
  }

  /** Returns the primitive value of the specified object. */
  valueOf(): I64Array {
    return this;
  }

  /** Yields each value in the array. */
  values(): IterableIterator<bigint> {
    return this[Symbol.iterator]();
  }
}
// const U64Array: typeof BigUint64Array =
//   typeof BigUint64Array !== "undefined" ? BigUint64Array : class BigUint64Array {};

export { I64Array as BigInt64Array };
// export { U64Array as BigUint64Array };
