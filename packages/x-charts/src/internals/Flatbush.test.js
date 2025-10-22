"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle,no-plusplus,no-bitwise */
var vitest_1 = require("vitest");
var Flatbush_1 = require("./Flatbush");
var data = [
    8, 62, 11, 66, 57, 17, 57, 19, 76, 26, 79, 29, 36, 56, 38, 56, 92, 77, 96, 80, 87, 70, 90, 74, 43,
    41, 47, 43, 0, 58, 2, 62, 76, 86, 80, 89, 27, 13, 27, 15, 71, 63, 75, 67, 25, 2, 27, 2, 87, 6, 88,
    6, 22, 90, 23, 93, 22, 89, 22, 93, 57, 11, 61, 13, 61, 55, 63, 56, 17, 85, 21, 87, 33, 43, 37, 43,
    6, 1, 7, 3, 80, 87, 80, 87, 23, 50, 26, 52, 58, 89, 58, 89, 12, 30, 15, 34, 32, 58, 36, 61, 41,
    84, 44, 87, 44, 18, 44, 19, 13, 63, 15, 67, 52, 70, 54, 74, 57, 59, 58, 59, 17, 90, 20, 92, 48,
    53, 52, 56, 92, 68, 92, 72, 26, 52, 30, 52, 56, 23, 57, 26, 88, 48, 88, 48, 66, 13, 67, 15, 7, 82,
    8, 86, 46, 68, 50, 68, 37, 33, 38, 36, 6, 15, 8, 18, 85, 36, 89, 38, 82, 45, 84, 48, 12, 2, 16, 3,
    26, 15, 26, 16, 55, 23, 59, 26, 76, 37, 79, 39, 86, 74, 90, 77, 16, 75, 18, 78, 44, 18, 45, 21,
    52, 67, 54, 71, 59, 78, 62, 78, 24, 5, 24, 8, 64, 80, 64, 83, 66, 55, 70, 55, 0, 17, 2, 19, 15,
    71, 18, 74, 87, 57, 87, 59, 6, 34, 7, 37, 34, 30, 37, 32, 51, 19, 53, 19, 72, 51, 73, 55, 29, 45,
    30, 45, 94, 94, 96, 95, 7, 22, 11, 24, 86, 45, 87, 48, 33, 62, 34, 65, 18, 10, 21, 14, 64, 66, 67,
    67, 64, 25, 65, 28, 27, 4, 31, 6, 84, 4, 85, 5, 48, 80, 50, 81, 1, 61, 3, 61, 71, 89, 74, 92, 40,
    42, 43, 43, 27, 64, 28, 66, 46, 26, 50, 26, 53, 83, 57, 87, 14, 75, 15, 79, 31, 45, 34, 45, 89,
    84, 92, 88, 84, 51, 85, 53, 67, 87, 67, 89, 39, 26, 43, 27, 47, 61, 47, 63, 23, 49, 25, 53, 12, 3,
    14, 5, 16, 50, 19, 53, 63, 80, 64, 84, 22, 63, 22, 64, 26, 66, 29, 66, 2, 15, 3, 15, 74, 77, 77,
    79, 64, 11, 68, 11, 38, 4, 39, 8, 83, 73, 87, 77, 85, 52, 89, 56, 74, 60, 76, 63, 62, 66, 65, 67,
];
function createIndex() {
    var index = new Flatbush_1.Flatbush(data.length / 4);
    for (var i = 0; i < data.length; i += 4) {
        index.add(data[i], data[i + 1], data[i + 2], data[i + 3]);
    }
    index.finish();
    return index;
}
function createSmallIndex(numItems, nodeSize) {
    var index = new Flatbush_1.Flatbush(numItems, nodeSize);
    for (var i = 0; i < 4 * numItems; i += 4) {
        index.add(data[i], data[i + 1], data[i + 2], data[i + 3]);
    }
    index.finish();
    return index;
}
(0, vitest_1.test)('indexes a bunch of rectangles', function () {
    var index = createIndex();
    var len = index._boxes.length;
    (0, vitest_1.expect)(index._boxes.length + index._indices.length).to.eq(540);
    (0, vitest_1.expect)(Array.from(index._boxes.subarray(len - 4, len))).to.deep.eq([
        0, 1, 96, 95,
    ]);
    (0, vitest_1.expect)(index._indices[len / 4 - 1]).to.eq(400);
});
(0, vitest_1.test)('skips sorting less than nodeSize number of rectangles', function () {
    var numItems = 14;
    var nodeSize = 16;
    var index = createSmallIndex(numItems, nodeSize);
    // compute expected root box extents
    var rootXMin = Infinity;
    var rootYMin = Infinity;
    var rootXMax = -Infinity;
    var rootYMax = -Infinity;
    for (var i = 0; i < 4 * numItems; i += 4) {
        if (data[i] < rootXMin) {
            rootXMin = data[i];
        }
        if (data[i + 1] < rootYMin) {
            rootYMin = data[i + 1];
        }
        if (data[i + 2] > rootXMax) {
            rootXMax = data[i + 2];
        }
        if (data[i + 3] > rootYMax) {
            rootYMax = data[i + 3];
        }
    }
    // sort should be skipped, ordered progressing indices expected
    var expectedIndices = [];
    for (var i = 0; i < numItems; ++i) {
        expectedIndices.push(i);
    }
    expectedIndices.push(0);
    var len = index._boxes.length;
    (0, vitest_1.expect)(Array.from(index._indices)).to.deep.eq(expectedIndices);
    (0, vitest_1.expect)(len).to.eq((numItems + 1) * 4);
    (0, vitest_1.expect)(Array.from(index._boxes.subarray(len - 4, len))).to.deep.eq([
        rootXMin,
        rootYMin,
        rootXMax,
        rootYMax,
    ]);
});
(0, vitest_1.test)('performs bbox search', function () {
    var index = createIndex();
    var ids = index.search(40, 40, 60, 60);
    var results = [];
    for (var i = 0; i < ids.length; i += 3) {
        results.push(data[4 * ids[i]]);
        results.push(data[4 * ids[i] + 1]);
        results.push(data[4 * ids[i] + 2]);
        results.push(data[4 * ids[i] + 3]);
    }
    (0, vitest_1.expect)(results.sort(compare)).to.deep.eq([57, 59, 58, 59, 48, 53, 52, 56, 40, 42, 43, 43, 43, 41, 47, 43].sort(compare));
});
(0, vitest_1.test)('reconstructs an index from array buffer', function () {
    var index = createIndex();
    var index2 = Flatbush_1.Flatbush.from(index.data);
    (0, vitest_1.expect)(index).to.deep.eq(index2);
});
(0, vitest_1.test)('throws an error when reconstructing an index from array buffer if not 8-byte aligned', function () {
    var index = createIndex();
    var byteOffset = 12;
    var newArrayBuffer = new ArrayBuffer(index.data.byteLength + byteOffset);
    var newView = new Uint8Array(newArrayBuffer, byteOffset);
    newView.set(new Uint8Array(index.data));
    (0, vitest_1.expect)(function () { return Flatbush_1.Flatbush.from(newArrayBuffer, byteOffset); }).to.throw();
});
(0, vitest_1.test)('reconstructs an index from a Uint8Array', function () {
    var index = createIndex();
    var byteOffset = 16;
    var newArrayBuffer = new ArrayBuffer(index.data.byteLength + byteOffset);
    var newView = new Uint8Array(newArrayBuffer, byteOffset);
    newView.set(new Uint8Array(index.data));
    var index2 = Flatbush_1.Flatbush.from(newArrayBuffer, byteOffset);
    (0, vitest_1.expect)(index._boxes).to.deep.eq(index2._boxes);
    (0, vitest_1.expect)(index._indices).to.deep.eq(index2._indices);
    (0, vitest_1.expect)(index.numItems).to.eq(index2.numItems);
    (0, vitest_1.expect)(index.nodeSize).to.eq(index2.nodeSize);
    (0, vitest_1.expect)(index._levelBounds).to.deep.eq(index2._levelBounds);
    (0, vitest_1.expect)(index.byteOffset).not.to.eq(index2.byteOffset);
});
(0, vitest_1.test)('defaults to adding a point when not providing maxX/maxY', function () {
    var index = new Flatbush_1.Flatbush(1);
    index.add(10, 10);
    index.finish();
    (0, vitest_1.expect)(index.search(0, 0, 20, 20)).to.deep.eq([0, 10, 10]);
});
(0, vitest_1.test)('throws an error if added less items than the index size', function () {
    (0, vitest_1.expect)(function () {
        var index = new Flatbush_1.Flatbush(data.length / 4);
        index.finish();
    }).to.throw();
});
(0, vitest_1.test)('throws an error if searching before indexing', function () {
    (0, vitest_1.expect)(function () {
        var index = new Flatbush_1.Flatbush(data.length / 4);
        index.search(0, 0, 20, 20);
    }).to.throw();
});
(0, vitest_1.test)('does not freeze on numItems = 0', { timeout: 100 }, function () {
    (0, vitest_1.expect)(function () {
        new Flatbush_1.Flatbush(0); // eslint-disable-line
    }).to.throw();
});
(0, vitest_1.test)('performs a k-nearest-neighbors query', function () {
    var index = createIndex();
    var ids = index.neighbors(50, 50, 3);
    (0, vitest_1.expect)(ids.sort(compare)).to.deep.eq([31, 6, 75].sort(compare));
});
(0, vitest_1.test)('k-nearest-neighbors query accepts maxDistance', function () {
    var index = createIndex();
    var ids = index.neighbors(50, 50, Infinity, Math.pow(12, 2));
    (0, vitest_1.expect)(ids.sort(compare)).to.deep.eq([6, 29, 31, 75, 85].sort(compare));
});
(0, vitest_1.test)('k-nearest-neighbors query accepts filterFn', function () {
    var index = createIndex();
    var ids = index.neighbors(50, 50, 6, Infinity, function (i) { return i % 2 === 0; });
    (0, vitest_1.expect)(ids.sort(compare)).to.deep.eq([6, 16, 18, 24, 54, 80].sort(compare));
});
(0, vitest_1.test)('performs a k-nearest-neighbors query with all items', function () {
    var index = createIndex();
    var ids = index.neighbors(50, 50);
    (0, vitest_1.expect)(ids.length).to.eq(data.length >> 2);
});
(0, vitest_1.test)('returns index of newly-added rectangle', function () {
    var count = 5;
    var index = new Flatbush_1.Flatbush(count);
    var ids = [];
    for (var i = 0; i < count; i++) {
        var id = index.add(data[i], data[i + 1], data[i + 2], data[i + 3]);
        ids.push(id);
    }
    var expectedSequence = Array.from(Array(count), function (v, i) { return i; });
    (0, vitest_1.expect)(ids).to.deep.eq(expectedSequence);
});
(0, vitest_1.test)('quicksort should work with an inbalanced dataset', function () {
    var n = 15000;
    var index = new Flatbush_1.Flatbush(2 * n);
    function linspace(start, stop, num, endpoint) {
        if (endpoint === void 0) { endpoint = true; }
        var div = endpoint ? num - 1 : num;
        var step = (stop - start) / div;
        return Array.from({ length: num }, function (_, i) { return start + step * i; });
    }
    var items = linspace(0, 1000, n);
    var items2 = linspace(0, 1000, n);
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var p = items_1[_i];
        index.add(p, 0, p, 0);
    }
    for (var _a = 0, items2_1 = items2; _a < items2_1.length; _a++) {
        var p = items2_1[_a];
        index.add(p, 0, p, 0);
    }
    index.finish();
    (0, vitest_1.expect)(function () {
        index.search(-100, -1, 15000, 1);
    }).not.to.throw();
});
function compare(a, b) {
    return a - b;
}
