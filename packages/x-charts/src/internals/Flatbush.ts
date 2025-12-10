// @ts-nocheck
/* eslint-disable */
import FlatQueue from '@mui/x-charts-vendor/flatqueue';

const ARRAY_TYPES = [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
];
const VERSION = 3; // serialized format version

type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

export class Flatbush {
  _queue: FlatQueue<number>;
  _boxes: TypedArrayConstructor;
  _indices: Uint16Array | Uint32Array;
  data: ArrayBufferLike;
  numItems: number;
  nodeSize: number;
  _levelBounds: number[];
  byteOffset: number;

  /**
   * Recreate a Flatbush index from raw `ArrayBuffer` or `SharedArrayBuffer` data.
   * @param {ArrayBufferLike} data
   * @param {number} [byteOffset=0] byte offset to the start of the Flatbush buffer in the referenced ArrayBuffer.
   * @returns {Flatbush} index
   */
  static from(data, byteOffset = 0) {
    if (byteOffset % 8 !== 0) {
      throw new Error('byteOffset must be 8-byte aligned.');
    }

    // @ts-expect-error duck typing array buffers
    if (!data || data.byteLength === undefined || data.buffer) {
      throw new Error('Data must be an instance of ArrayBuffer or SharedArrayBuffer.');
    }

    const [magic, versionAndType] = new Uint8Array(data, byteOffset + 0, 2);
    if (magic !== 0xfb) {
      throw new Error('Data does not appear to be in a Flatbush format.');
    }
    const version = versionAndType >> 4;
    if (version !== VERSION) {
      throw new Error(`Got v${version} data when expected v${VERSION}.`);
    }
    const ArrayType = ARRAY_TYPES[versionAndType & 0x0f];
    if (!ArrayType) {
      throw new Error('Unrecognized array type.');
    }
    const [nodeSize] = new Uint16Array(data, byteOffset + 2, 1);
    const [numItems] = new Uint32Array(data, byteOffset + 4, 1);

    return new Flatbush(numItems, nodeSize, ArrayType, undefined, data, byteOffset);
  }

  /**
   * Create a Flatbush index that will hold a given number of items.
   * @param {number} numItems
   * @param {number} [nodeSize=16] Size of the tree node (16 by default).
   * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
   * @param {ArrayBufferConstructor | SharedArrayBufferConstructor} [ArrayBufferType=ArrayBuffer] The array buffer type used to store data (`ArrayBuffer` by default).
   * @param {ArrayBufferLike} [data] (Only used internally)
   * @param {number} [byteOffset=0] (Only used internally)
   */
  constructor(
    numItems: number,
    nodeSize: number = 16,
    ArrayType: TypedArrayConstructor = Float64Array,
    ArrayBufferType: ArrayBufferConstructor | SharedArrayBufferConstructor = ArrayBuffer,
    data?: ArrayBufferLike,
    byteOffset = 0,
  ) {
    if (numItems === undefined) {
      throw new Error('Missing required argument: numItems.');
    }
    if (isNaN(numItems) || numItems <= 0) {
      throw new Error(`Unexpected numItems value: ${numItems}.`);
    }

    this.numItems = +numItems;
    this.nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
    this.byteOffset = byteOffset;

    // calculate the total number of nodes in the R-tree to allocate space for
    // and the index of each tree level (used in search later)
    let n = numItems;
    let numNodes = n;
    this._levelBounds = [n * 4];
    do {
      n = Math.ceil(n / this.nodeSize);
      numNodes += n;
      this._levelBounds.push(numNodes * 4);
    } while (n !== 1);

    this.ArrayType = ArrayType;
    this.IndexArrayType = numNodes < 16384 ? Uint16Array : Uint32Array;

    const arrayTypeIndex = ARRAY_TYPES.indexOf(ArrayType);
    const nodesByteSize = numNodes * 4 * ArrayType.BYTES_PER_ELEMENT;

    if (arrayTypeIndex < 0) {
      throw new Error(`Unexpected typed array class: ${ArrayType}.`);
    }

    if (data) {
      this.data = data;
      this._boxes = new ArrayType(data, byteOffset + 8, numNodes * 4);
      this._indices = new this.IndexArrayType(data, byteOffset + 8 + nodesByteSize, numNodes);

      this._pos = numNodes * 4;
      this.minX = this._boxes[this._pos - 4];
      this.minY = this._boxes[this._pos - 3];
      this.maxX = this._boxes[this._pos - 2];
      this.maxY = this._boxes[this._pos - 1];
    } else {
      const data = (this.data = new ArrayBufferType(
        8 + nodesByteSize + numNodes * this.IndexArrayType.BYTES_PER_ELEMENT,
      ));
      this._boxes = new ArrayType(data, 8, numNodes * 4);
      this._indices = new this.IndexArrayType(data, 8 + nodesByteSize, numNodes);
      this._pos = 0;
      this.minX = Infinity;
      this.minY = Infinity;
      this.maxX = -Infinity;
      this.maxY = -Infinity;

      new Uint8Array(data, 0, 2).set([0xfb, (VERSION << 4) + arrayTypeIndex]);
      new Uint16Array(data, 2, 1)[0] = nodeSize;
      new Uint32Array(data, 4, 1)[0] = numItems;
    }

    // a priority queue for k-nearest-neighbors queries
    /** @type FlatQueue<number> */
    this._queue = new FlatQueue();
  }

  /**
   * Add a given rectangle to the index.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {number} A zero-based, incremental number that represents the newly added rectangle.
   */
  add(minX, minY, maxX = minX, maxY = minY) {
    const index = this._pos >> 2;
    const boxes = this._boxes;
    this._indices[index] = index;
    boxes[this._pos++] = minX;
    boxes[this._pos++] = minY;
    boxes[this._pos++] = maxX;
    boxes[this._pos++] = maxY;

    if (minX < this.minX) {
      this.minX = minX;
    }
    if (minY < this.minY) {
      this.minY = minY;
    }
    if (maxX > this.maxX) {
      this.maxX = maxX;
    }
    if (maxY > this.maxY) {
      this.maxY = maxY;
    }

    return index;
  }

  /** Perform indexing of the added rectangles. */
  finish() {
    if (this._pos >> 2 !== this.numItems) {
      throw new Error(`Added ${this._pos >> 2} items when expected ${this.numItems}.`);
    }
    const boxes = this._boxes;

    if (this.numItems <= this.nodeSize) {
      // only one node, skip sorting and just fill the root box
      boxes[this._pos++] = this.minX;
      boxes[this._pos++] = this.minY;
      boxes[this._pos++] = this.maxX;
      boxes[this._pos++] = this.maxY;
      return;
    }

    const width = this.maxX - this.minX || 1;
    const height = this.maxY - this.minY || 1;
    const hilbertValues = new Uint32Array(this.numItems);
    const hilbertMax = (1 << 16) - 1;

    // map item centers into Hilbert coordinate space and calculate Hilbert values
    for (let i = 0, pos = 0; i < this.numItems; i++) {
      const minX = boxes[pos++];
      const minY = boxes[pos++];
      const maxX = boxes[pos++];
      const maxY = boxes[pos++];
      const x = Math.floor((hilbertMax * ((minX + maxX) / 2 - this.minX)) / width);
      const y = Math.floor((hilbertMax * ((minY + maxY) / 2 - this.minY)) / height);
      hilbertValues[i] = hilbert(x, y);
    }

    // sort items by their Hilbert value (for packing later)
    sort(hilbertValues, boxes, this._indices, 0, this.numItems - 1, this.nodeSize);

    // generate nodes at each tree level, bottom-up
    for (let i = 0, pos = 0; i < this._levelBounds.length - 1; i++) {
      const end = this._levelBounds[i];

      // generate a parent node for each block of consecutive <nodeSize> nodes
      while (pos < end) {
        const nodeIndex = pos;

        // calculate bbox for the new node
        let nodeMinX = boxes[pos++];
        let nodeMinY = boxes[pos++];
        let nodeMaxX = boxes[pos++];
        let nodeMaxY = boxes[pos++];
        for (let j = 1; j < this.nodeSize && pos < end; j++) {
          nodeMinX = Math.min(nodeMinX, boxes[pos++]);
          nodeMinY = Math.min(nodeMinY, boxes[pos++]);
          nodeMaxX = Math.max(nodeMaxX, boxes[pos++]);
          nodeMaxY = Math.max(nodeMaxY, boxes[pos++]);
        }

        // add the new node to the tree data
        this._indices[this._pos >> 2] = nodeIndex;
        boxes[this._pos++] = nodeMinX;
        boxes[this._pos++] = nodeMinY;
        boxes[this._pos++] = nodeMaxX;
        boxes[this._pos++] = nodeMaxY;
      }
    }
  }

  /**
   * Search the index by a bounding box.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @param {(index: number) => boolean} [filterFn] An optional function for filtering the results.
   * @returns {number[]} An array containing the index, the x coordinate and the y coordinate of the points intersecting or touching the given bounding box.
   */
  search(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    filterFn?: (index: number) => boolean,
  ): number[] {
    if (this._pos !== this._boxes.length) {
      throw new Error('Data not yet indexed - call index.finish().');
    }

    /** @type number | undefined */
    let nodeIndex = this._boxes.length - 4;
    const queue = [];
    const results = [];

    while (nodeIndex !== undefined) {
      // find the end index of the node
      const end = Math.min(nodeIndex + this.nodeSize * 4, upperBound(nodeIndex, this._levelBounds));

      // search through child nodes
      for (let /** @type number */ pos = nodeIndex; pos < end; pos += 4) {
        // check if node bbox intersects with query bbox
        if (maxX < this._boxes[pos]) {
          continue;
        } // maxX < nodeMinX
        if (maxY < this._boxes[pos + 1]) {
          continue;
        } // maxY < nodeMinY
        if (minX > this._boxes[pos + 2]) {
          continue;
        } // minX > nodeMaxX
        if (minY > this._boxes[pos + 3]) {
          continue;
        } // minY > nodeMaxY

        const index = this._indices[pos >> 2] | 0;

        if (nodeIndex >= this.numItems * 4) {
          queue.push(index); // node; add it to the search queue
        } else if (filterFn === undefined || filterFn(index)) {
          results.push(index);
          results.push(this._boxes[pos]); // leaf item
          results.push(this._boxes[pos + 1]);
        }
      }

      nodeIndex = queue.pop();
    }

    return results;
  }

  /**
   * Search items in order of distance from the given point.
   * @param x
   * @param y
   * @param [maxResults=Infinity]
   * @param maxDistSq
   * @param [filterFn] An optional function for filtering the results.
   * @param [sqDistFn] An optional function to calculate squared distance from the point to the item.
   * @returns {number[]} An array of indices of items found.
   */
  neighbors(
    x,
    y,
    maxResults = Infinity,
    maxDistSq: number = Infinity,
    filterFn?: (index: number) => boolean,
    sqDistFn = sqDist,
  ) {
    if (this._pos !== this._boxes.length) {
      throw new Error('Data not yet indexed - call index.finish().');
    }

    /** @type number | undefined */
    let nodeIndex = this._boxes.length - 4;
    const q = this._queue;
    const results = [];

    /* eslint-disable no-labels */
    outer: while (nodeIndex !== undefined) {
      // find the end index of the node
      const end = Math.min(nodeIndex + this.nodeSize * 4, upperBound(nodeIndex, this._levelBounds));

      // add child nodes to the queue
      for (let pos = nodeIndex; pos < end; pos += 4) {
        const index = this._indices[pos >> 2] | 0;
        const minX = this._boxes[pos];
        const minY = this._boxes[pos + 1];
        const maxX = this._boxes[pos + 2];
        const maxY = this._boxes[pos + 3];
        const dx = x < minX ? minX - x : x > maxX ? x - maxX : 0;
        const dy = y < minY ? minY - y : y > maxY ? y - maxY : 0;
        const dist = sqDistFn(dx, dy);

        if (dist > maxDistSq) {
          continue;
        }

        if (nodeIndex >= this.numItems * 4) {
          q.push(index << 1, dist); // node (use even id)
        } else if (filterFn === undefined || filterFn(index)) {
          q.push((index << 1) + 1, dist); // leaf item (use odd id)
        }
      }

      // pop items from the queue
      // @ts-expect-error q.length check eliminates undefined values
      while (q.length && q.peek() & 1) {
        const dist = q.peekValue();

        // @ts-expect-error
        if (dist > maxDistSq) {
          break outer;
        }
        // @ts-expect-error
        results.push(q.pop() >> 1);
        if (results.length === maxResults) {
          break outer;
        }
      }

      // @ts-expect-error
      nodeIndex = q.length ? q.pop() >> 1 : undefined;
    }

    q.clear();
    return results;
  }
}

function sqDist(dx: number, dy: number) {
  return dx * dx + dy * dy;
}

/**
 * Binary search for the first value in the array bigger than the given.
 * @param {number} value
 * @param {number[]} arr
 */
function upperBound(value, arr) {
  let i = 0;
  let j = arr.length - 1;
  while (i < j) {
    const m = (i + j) >> 1;
    if (arr[m] > value) {
      j = m;
    } else {
      i = m + 1;
    }
  }
  return arr[i];
}

/**
 * Custom quicksort that partially sorts bbox data alongside the hilbert values.
 * @param {Uint32Array} values
 * @param {InstanceType<TypedArrayConstructor>} boxes
 * @param {Uint16Array | Uint32Array} indices
 * @param {number} left
 * @param {number} right
 * @param {number} nodeSize
 */
function sort(values, boxes, indices, left, right, nodeSize) {
  if (Math.floor(left / nodeSize) >= Math.floor(right / nodeSize)) {
    return;
  }

  // apply median of three method
  const start = values[left];
  const mid = values[(left + right) >> 1];
  const end = values[right];

  let pivot = end;

  const x = Math.max(start, mid);
  if (end > x) {
    pivot = x;
  } else if (x === start) {
    pivot = Math.max(mid, end);
  } else if (x === mid) {
    pivot = Math.max(start, end);
  }

  let i = left - 1;
  let j = right + 1;

  while (true) {
    do {
      i++;
    } while (values[i] < pivot);
    do {
      j--;
    } while (values[j] > pivot);
    if (i >= j) {
      break;
    }
    swap(values, boxes, indices, i, j);
  }

  sort(values, boxes, indices, left, j, nodeSize);
  sort(values, boxes, indices, j + 1, right, nodeSize);
}

/**
 * Swap two values and two corresponding boxes.
 * @param {Uint32Array} values
 * @param {InstanceType<TypedArrayConstructor>} boxes
 * @param {Uint16Array | Uint32Array} indices
 * @param {number} i
 * @param {number} j
 */
function swap(values, boxes, indices, i, j) {
  const temp = values[i];
  values[i] = values[j];
  values[j] = temp;

  const k = 4 * i;
  const m = 4 * j;

  const a = boxes[k];
  const b = boxes[k + 1];
  const c = boxes[k + 2];
  const d = boxes[k + 3];
  boxes[k] = boxes[m];
  boxes[k + 1] = boxes[m + 1];
  boxes[k + 2] = boxes[m + 2];
  boxes[k + 3] = boxes[m + 3];
  boxes[m] = a;
  boxes[m + 1] = b;
  boxes[m + 2] = c;
  boxes[m + 3] = d;

  const e = indices[i];
  indices[i] = indices[j];
  indices[j] = e;
}

/**
 * Fast Hilbert curve algorithm by http://threadlocalmutex.com/
 * Ported from C++ https://github.com/rawrunprotected/hilbert_curves (public domain)
 * @param {number} x
 * @param {number} y
 */
function hilbert(x, y) {
  let a = x ^ y;
  let b = 0xffff ^ a;
  let c = 0xffff ^ (x | y);
  let d = x & (y ^ 0xffff);

  let A = a | (b >> 1);
  let B = (a >> 1) ^ a;
  let C = (c >> 1) ^ (b & (d >> 1)) ^ c;
  let D = (a & (c >> 1)) ^ (d >> 1) ^ d;

  a = A;
  b = B;
  c = C;
  d = D;
  A = (a & (a >> 2)) ^ (b & (b >> 2));
  B = (a & (b >> 2)) ^ (b & ((a ^ b) >> 2));
  C ^= (a & (c >> 2)) ^ (b & (d >> 2));
  D ^= (b & (c >> 2)) ^ ((a ^ b) & (d >> 2));

  a = A;
  b = B;
  c = C;
  d = D;
  A = (a & (a >> 4)) ^ (b & (b >> 4));
  B = (a & (b >> 4)) ^ (b & ((a ^ b) >> 4));
  C ^= (a & (c >> 4)) ^ (b & (d >> 4));
  D ^= (b & (c >> 4)) ^ ((a ^ b) & (d >> 4));

  a = A;
  b = B;
  c = C;
  d = D;
  C ^= (a & (c >> 8)) ^ (b & (d >> 8));
  D ^= (b & (c >> 8)) ^ ((a ^ b) & (d >> 8));

  a = C ^ (C >> 1);
  b = D ^ (D >> 1);

  let i0 = x ^ y;
  let i1 = b | (0xffff ^ (i0 | a));

  i0 = (i0 | (i0 << 8)) & 0x00ff00ff;
  i0 = (i0 | (i0 << 4)) & 0x0f0f0f0f;
  i0 = (i0 | (i0 << 2)) & 0x33333333;
  i0 = (i0 | (i0 << 1)) & 0x55555555;

  i1 = (i1 | (i1 << 8)) & 0x00ff00ff;
  i1 = (i1 | (i1 << 4)) & 0x0f0f0f0f;
  i1 = (i1 | (i1 << 2)) & 0x33333333;
  i1 = (i1 | (i1 << 1)) & 0x55555555;

  return ((i1 << 1) | i0) >>> 0;
}
