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

  //   [Symbol.iterator](): IterableIterator<bigint>;

  //   readonly [Symbol.toStringTag]: "BigInt64Array";

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
      this.buffer = new ArrayBuffer(arg * BigInt64Array.BYTES_PER_ELEMENT);
      this.byteLength = this.buffer.byteLength;
      this.byteOffset = 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    } else if (isIterable(arg)) {
      const values = [...arg];
      this.buffer = new ArrayBuffer(values.length * BigInt64Array.BYTES_PER_ELEMENT);
      this.byteLength = this.buffer.byteLength;
      this.byteOffset = 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
      for (let i = 0; i < values.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = values[i]!;
        this.dataView.setUint32(i * BigInt64Array.BYTES_PER_ELEMENT, Number(value & 0xffffffffn));
        this.dataView.setUint32(
          i * BigInt64Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT,
          Number((value >> 32n) & 0xffffffffn),
        );
      }
    } else {
      this.buffer = arg;
      this.byteLength = (maybeLength ?? 0) * BigInt64Array.BYTES_PER_ELEMENT;
      this.byteOffset = byteOffset ?? 0;
      this.dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    }
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "string" && prop.length > 0) {
          const idx = +prop;
          if (Number.isFinite(idx)) {
            return target.at(idx);
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  at(idx: number): bigint | undefined {
    if (idx * BigInt64Array.BYTES_PER_ELEMENT >= this.byteLength) {
      return undefined;
    }
    const lo = this.dataView.getUint32(idx * BigInt64Array.BYTES_PER_ELEMENT);
    const hi = this.dataView.getUint32(
      idx * BigInt64Array.BYTES_PER_ELEMENT + Uint32Array.BYTES_PER_ELEMENT,
    );
    return (BigInt(hi) << 32n) | BigInt(lo);
  }

  static of(...items: bigint[]): BigInt64Array {
    return this.from(items);
  }
  static from(arrayLike: ArrayLike<bigint>): BigInt64Array;
  static from<U>(
    arrayLike: ArrayLike<U>,
    mapfn: (v: U, k: number) => bigint,
    thisArg?: unknown,
  ): BigInt64Array;
  static from<U>(
    arrayLike: ArrayLike<U>,
    mapfn?: (v: U, k: number) => bigint,
    thisArg?: unknown,
  ): BigInt64Array {
    const result = new this(arrayLike.length);
    if (mapfn) {
      if (thisArg) {
        mapfn = mapfn.bind(thisArg);
      }
      for (let i = 0; i < arrayLike.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[i] = mapfn(arrayLike[i]!, i);
      }
    } else {
      for (let i = 0; i < arrayLike.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[i] = (arrayLike as unknown as ArrayLike<bigint>)[i]!;
      }
    }
    return result as unknown as BigInt64Array;
  }

  //   /**
  //    * Returns the this object after copying a section of the array identified by start and end
  //    * to the same array starting at position target
  //    * @param target If target is negative, it is treated as length+target where length is the
  //    * length of the array.
  //    * @param start If start is negative, it is treated as length+start. If end is negative, it
  //    * is treated as length+end.
  //    * @param end If not specified, length of the this object is used as its default value.
  //    */
  //   copyWithin(target: number, start: number, end?: number): this;

  //   /** Yields index, value pairs for every entry in the array. */
  //   entries(): IterableIterator<[number, bigint]>;

  //   /**
  //    * Determines whether all the members of an array satisfy the specified test.
  //    * @param predicate A function that accepts up to three arguments. The every method calls
  //    * the predicate function for each element in the array until the predicate returns false,
  //    * or until the end of the array.
  //    * @param thisArg An object to which the this keyword can refer in the predicate function.
  //    * If thisArg is omitted, undefined is used as the this value.
  //    */
  //   every(
  //     predicate: (value: bigint, index: number, array: BigInt64Array) => boolean,
  //     thisArg?: any,
  //   ): boolean;

  //   /**
  //    * Returns the this object after filling the section identified by start and end with value
  //    * @param value value to fill array section with
  //    * @param start index to start filling the array at. If start is negative, it is treated as
  //    * length+start where length is the length of the array.
  //    * @param end index to stop filling the array at. If end is negative, it is treated as
  //    * length+end.
  //    */
  //   fill(value: bigint, start?: number, end?: number): this;

  //   /**
  //    * Returns the elements of an array that meet the condition specified in a callback function.
  //    * @param predicate A function that accepts up to three arguments. The filter method calls
  //    * the predicate function one time for each element in the array.
  //    * @param thisArg An object to which the this keyword can refer in the predicate function.
  //    * If thisArg is omitted, undefined is used as the this value.
  //    */
  //   filter(
  //     predicate: (value: bigint, index: number, array: BigInt64Array) => any,
  //     thisArg?: any,
  //   ): BigInt64Array;

  //   /**
  //    * Returns the value of the first element in the array where predicate is true, and undefined
  //    * otherwise.
  //    * @param predicate find calls predicate once for each element of the array, in ascending
  //    * order, until it finds one where predicate returns true. If such an element is found, find
  //    * immediately returns that element value. Otherwise, find returns undefined.
  //    * @param thisArg If provided, it will be used as the this value for each invocation of
  //    * predicate. If it is not provided, undefined is used instead.
  //    */
  //   find(
  //     predicate: (value: bigint, index: number, array: BigInt64Array) => boolean,
  //     thisArg?: any,
  //   ): bigint | undefined;

  //   /**
  //    * Returns the index of the first element in the array where predicate is true, and -1
  //    * otherwise.
  //    * @param predicate find calls predicate once for each element of the array, in ascending
  //    * order, until it finds one where predicate returns true. If such an element is found,
  //    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
  //    * @param thisArg If provided, it will be used as the this value for each invocation of
  //    * predicate. If it is not provided, undefined is used instead.
  //    */
  //   findIndex(
  //     predicate: (value: bigint, index: number, array: BigInt64Array) => boolean,
  //     thisArg?: any,
  //   ): number;

  //   /**
  //    * Performs the specified action for each element in an array.
  //    * @param callbackfn A function that accepts up to three arguments. forEach calls the
  //    * callbackfn function one time for each element in the array.
  //    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
  //    * If thisArg is omitted, undefined is used as the this value.
  //    */
  //   forEach(
  //     callbackfn: (value: bigint, index: number, array: BigInt64Array) => void,
  //     thisArg?: any,
  //   ): void;

  //   /**
  //    * Determines whether an array includes a certain element, returning true or false as appropriate.
  //    * @param searchElement The element to search for.
  //    * @param fromIndex The position in this array at which to begin searching for searchElement.
  //    */
  //   includes(searchElement: bigint, fromIndex?: number): boolean;

  //   /**
  //    * Returns the index of the first occurrence of a value in an array.
  //    * @param searchElement The value to locate in the array.
  //    * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
  //    * search starts at index 0.
  //    */
  //   indexOf(searchElement: bigint, fromIndex?: number): number;

  //   /**
  //    * Adds all the elements of an array separated by the specified separator string.
  //    * @param separator A string used to separate one element of an array from the next in the
  //    * resulting String. If omitted, the array elements are separated with a comma.
  //    */
  //   join(separator?: string): string;

  //   /** Yields each index in the array. */
  //   keys(): IterableIterator<number>;

  //   /**
  //    * Returns the index of the last occurrence of a value in an array.
  //    * @param searchElement The value to locate in the array.
  //    * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
  //    * search starts at index 0.
  //    */
  //   lastIndexOf(searchElement: bigint, fromIndex?: number): number;

  //   /** The length of the array. */
  //   readonly length: number;

  //   /**
  //    * Calls a defined callback function on each element of an array, and returns an array that
  //    * contains the results.
  //    * @param callbackfn A function that accepts up to three arguments. The map method calls the
  //    * callbackfn function one time for each element in the array.
  //    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
  //    * If thisArg is omitted, undefined is used as the this value.
  //    */
  //   map(
  //     callbackfn: (value: bigint, index: number, array: BigInt64Array) => bigint,
  //     thisArg?: any,
  //   ): BigInt64Array;

  //   /**
  //    * Calls the specified callback function for all the elements in an array. The return value of
  //    * the callback function is the accumulated result, and is provided as an argument in the next
  //    * call to the callback function.
  //    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
  //    * callbackfn function one time for each element in the array.
  //    * @param initialValue If initialValue is specified, it is used as the initial value to start
  //    * the accumulation. The first call to the callbackfn function provides this value as an argument
  //    * instead of an array value.
  //    */
  //   reduce(
  //     callbackfn: (
  //       previousValue: bigint,
  //       currentValue: bigint,
  //       currentIndex: number,
  //       array: BigInt64Array,
  //     ) => bigint,
  //   ): bigint;

  //   /**
  //    * Calls the specified callback function for all the elements in an array. The return value of
  //    * the callback function is the accumulated result, and is provided as an argument in the next
  //    * call to the callback function.
  //    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
  //    * callbackfn function one time for each element in the array.
  //    * @param initialValue If initialValue is specified, it is used as the initial value to start
  //    * the accumulation. The first call to the callbackfn function provides this value as an argument
  //    * instead of an array value.
  //    */
  //   reduce<U>(
  //     callbackfn: (
  //       previousValue: U,
  //       currentValue: bigint,
  //       currentIndex: number,
  //       array: BigInt64Array,
  //     ) => U,
  //     initialValue: U,
  //   ): U;

  //   /**
  //    * Calls the specified callback function for all the elements in an array, in descending order.
  //    * The return value of the callback function is the accumulated result, and is provided as an
  //    * argument in the next call to the callback function.
  //    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
  //    * the callbackfn function one time for each element in the array.
  //    * @param initialValue If initialValue is specified, it is used as the initial value to start
  //    * the accumulation. The first call to the callbackfn function provides this value as an
  //    * argument instead of an array value.
  //    */
  //   reduceRight(
  //     callbackfn: (
  //       previousValue: bigint,
  //       currentValue: bigint,
  //       currentIndex: number,
  //       array: BigInt64Array,
  //     ) => bigint,
  //   ): bigint;

  //   /**
  //    * Calls the specified callback function for all the elements in an array, in descending order.
  //    * The return value of the callback function is the accumulated result, and is provided as an
  //    * argument in the next call to the callback function.
  //    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
  //    * the callbackfn function one time for each element in the array.
  //    * @param initialValue If initialValue is specified, it is used as the initial value to start
  //    * the accumulation. The first call to the callbackfn function provides this value as an argument
  //    * instead of an array value.
  //    */
  //   reduceRight<U>(
  //     callbackfn: (
  //       previousValue: U,
  //       currentValue: bigint,
  //       currentIndex: number,
  //       array: BigInt64Array,
  //     ) => U,
  //     initialValue: U,
  //   ): U;

  //   /** Reverses the elements in the array. */
  //   reverse(): this;

  //   /**
  //    * Sets a value or an array of values.
  //    * @param array A typed or untyped array of values to set.
  //    * @param offset The index in the current array at which the values are to be written.
  //    */
  //   set(array: ArrayLike<bigint>, offset?: number): void;

  //   /**
  //    * Returns a section of an array.
  //    * @param start The beginning of the specified portion of the array.
  //    * @param end The end of the specified portion of the array.
  //    */
  //   slice(start?: number, end?: number): BigInt64Array;

  //   /**
  //    * Determines whether the specified callback function returns true for any element of an array.
  //    * @param predicate A function that accepts up to three arguments. The some method calls the
  //    * predicate function for each element in the array until the predicate returns true, or until
  //    * the end of the array.
  //    * @param thisArg An object to which the this keyword can refer in the predicate function.
  //    * If thisArg is omitted, undefined is used as the this value.
  //    */
  //   some(
  //     predicate: (value: bigint, index: number, array: BigInt64Array) => boolean,
  //     thisArg?: any,
  //   ): boolean;

  //   /**
  //    * Sorts the array.
  //    * @param compareFn The function used to determine the order of the elements. If omitted, the elements are sorted in ascending order.
  //    */
  //   sort(compareFn?: (a: bigint, b: bigint) => number | bigint): this;

  //   /**
  //    * Gets a new BigInt64Array view of the ArrayBuffer store for this array, referencing the elements
  //    * at begin, inclusive, up to end, exclusive.
  //    * @param begin The index of the beginning of the array.
  //    * @param end The index of the end of the array.
  //    */
  //   subarray(begin?: number, end?: number): BigInt64Array;

  //   /** Converts the array to a string by using the current locale. */
  //   toLocaleString(): string;

  //   /** Returns a string representation of the array. */
  //   toString(): string;

  //   /** Returns the primitive value of the specified object. */
  //   valueOf(): BigInt64Array;

  //   /** Yields each value in the array. */
  //   values(): IterableIterator<bigint>;
}
// const U64Array: typeof BigUint64Array =
//   typeof BigUint64Array !== "undefined" ? BigUint64Array : class BigUint64Array {};

export { I64Array as BigInt64Array };
// export { U64Array as BigUint64Array };
