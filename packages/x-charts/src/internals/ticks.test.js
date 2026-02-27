"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ticks_1 = require("./ticks");
describe('scaleTickNumberByRange', function () {
    it('should return 1 when rangeGap is 0 (range start and end are the same)', function () {
        var result = (0, ticks_1.scaleTickNumberByRange)(10, [50, 50]);
        expect(result).to.equal(1);
    });
    it('should correctly scale tickNumber based on range', function () {
        var result = (0, ticks_1.scaleTickNumberByRange)(100, [0, 50]);
        expect(result).to.equal(200);
    });
});
