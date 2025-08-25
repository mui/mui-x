"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findMinMax_1 = require("./findMinMax");
describe('findMinMax', function () {
    it('should find min and max in a simple array', function () {
        expect((0, findMinMax_1.findMinMax)([1, 2, 3, 4, 5])).to.deep.equal([1, 5]);
    });
    it('should handle negative numbers', function () {
        expect((0, findMinMax_1.findMinMax)([-5, -2, 0, 3, 8])).to.deep.equal([-5, 8]);
    });
    it('should handle array with same numbers', function () {
        expect((0, findMinMax_1.findMinMax)([2, 2, 2, 2])).to.deep.equal([2, 2]);
    });
    it('should handle single element array', function () {
        expect((0, findMinMax_1.findMinMax)([1])).to.deep.equal([1, 1]);
    });
    it('should handle empty array', function () {
        expect((0, findMinMax_1.findMinMax)([])).to.deep.equal([Infinity, -Infinity]);
    });
    it('should handle decimal numbers', function () {
        expect((0, findMinMax_1.findMinMax)([1.5, 2.7, -3.2, 0.1])).to.deep.equal([-3.2, 2.7]);
    });
    it('should handle one million elements', function () {
        var largeArray = Array.from({ length: 1000000 }, function (_, i) { return i - 5000; }); // [-500, -499, ..., 499]
        expect((0, findMinMax_1.findMinMax)(largeArray)).to.deep.equal([-5000, 994999]);
    });
});
