"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var Flatbush_1 = require("./Flatbush");
var data = [], n = 1000000;
// Generate and position the datapoints in a tangent wave pattern
for (var i = 0; i < n; i += 1) {
    var theta = Math.random() * 2 * Math.PI;
    var radius = Math.pow(Math.random(), 2) * 100;
    var waveDeviation = (Math.random() - 0.5) * 70;
    var waveValue = Math.tan(theta) * waveDeviation;
    data.push({
        x: 50 + (radius + waveValue) * Math.cos(theta),
        y: 50 + (radius + waveValue) * Math.sin(theta),
    });
}
var flatbush1M = new Flatbush_1.Flatbush(data.length);
for (var i = 0; i < data.length; i += 1) {
    flatbush1M.add(data[i].x, data[i].y);
}
flatbush1M.finish();
(0, vitest_1.describe)('Flatbush benchmarks', function () {
    (0, vitest_1.describe)('add + finish', function () {
        (0, vitest_1.bench)('add 1M points + finish', function () {
            var flatbush = new Flatbush_1.Flatbush(data.length);
            for (var i = 0; i < data.length; i += 1) {
                flatbush.add(data[i].x, data[i].y);
            }
            flatbush.finish();
        });
    });
    (0, vitest_1.describe)('search 1M points', function () {
        (0, vitest_1.bench)('search 1M points', function () {
            flatbush1M.search(0.4, 0.4, 0.6, 0.6);
        });
    });
    (0, vitest_1.describe)('neighbors 1M points', function () {
        (0, vitest_1.bench)('neighbors 1M points', function () {
            flatbush1M.neighbors(0.5, 0.5, 1, 0.04, undefined);
        });
    });
});
