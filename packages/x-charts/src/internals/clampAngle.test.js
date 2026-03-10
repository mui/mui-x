"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clampAngle_1 = require("./clampAngle");
describe('clampAngle', function () {
    it('should clamp angle', function () {
        var tests = [
            { input: 0, expected: 0 },
            { input: 360, expected: 0 },
            { input: 720, expected: 0 },
            { input: -360, expected: 0 },
            { input: -360 - 90, expected: 270 },
            { input: 45, expected: 45 },
            { input: 405, expected: 45 },
            { input: -315, expected: 45 },
            { input: -45, expected: 315 },
        ];
        tests.forEach(function (_a) {
            var input = _a.input, expected = _a.expected;
            expect((0, clampAngle_1.clampAngle)(input)).to.eq(expected);
        });
    });
});
