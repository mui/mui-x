"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDeepEqual_1 = require("./isDeepEqual");
var testValues = [
    [null, null, true],
    [undefined, undefined, true],
    [null, undefined, false],
    [undefined, null, false],
    ['undefined', undefined, false],
    ['undefined', 'undefined', true],
    [1, 1, true],
    [1, 4, false],
    [3.123, 3.123, true],
    [3.1234567, 3.123, false],
    [false, false, true],
    [true, true, true],
    [true, false, false],
    [false, false, true],
    [[], [], true],
    [[], [1], false],
    [[1], [1], true],
    [[1, 2, 3], [1, 3, 'string'], false],
    [[1, 2, 'string'], [1, 3, 'string'], false],
    [[1, '2', null, { object: 1 }], [1, '2', null, { object: 1 }], true],
    [[1, 2, { object: 1 }], [1, 2, { object: 'string' }], false],
    [{}, {}, true],
    [{}, { test: 1 }, false],
    [{ test: 1 }, {}, false],
    [{ test: 1 }, { test: 1 }, true],
    [{ test: 1 }, { test: 2 }, false],
    [{ test: 1, deep: { test: 2 } }, { test: 1, deep: { test: 2 } }, true],
    [{ test: 1, deep: { test: 'string' } }, { test: 1, deep: { test: 2 } }, false],
];
describe('isDeepEqual', function () {
    testValues.forEach(function (_a) {
        var a = _a[0], b = _a[1], expectedResult = _a[2];
        it("should compare ".concat(a, " and ").concat(b, " to be ").concat(expectedResult), function () {
            expect((0, isDeepEqual_1.isDeepEqual)(a, b)).to.equal(expectedResult);
        });
    });
});
