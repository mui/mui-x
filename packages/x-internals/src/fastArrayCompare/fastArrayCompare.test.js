"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastArrayCompare_1 = require("./fastArrayCompare");
describe('fastArrayCompare', function () {
    it('should return true if arrays are equal', function () {
        expect((0, fastArrayCompare_1.fastArrayCompare)([1, 2, 3], [1, 2, 3])).to.equal(true);
    });
    it('should return false if arrays are not equal', function () {
        expect((0, fastArrayCompare_1.fastArrayCompare)([1, 2, 3], [1, 2, 4])).to.equal(false);
    });
    it('should return false if arrays have different lengths', function () {
        expect((0, fastArrayCompare_1.fastArrayCompare)([1, 2, 3], [1, 2])).to.equal(false);
    });
    it('should return false if one of the arguments is not an array', function () {
        // @ts-expect-error
        expect((0, fastArrayCompare_1.fastArrayCompare)([1, 2, 3], 1)).to.equal(false);
    });
    it('should return false if both arguments are not an array', function () {
        expect((0, fastArrayCompare_1.fastArrayCompare)(1, 2)).to.equal(false);
    });
    it('should return true if both arguments are the same array', function () {
        var arr = [1, 2, 3];
        expect((0, fastArrayCompare_1.fastArrayCompare)(arr, arr)).to.equal(true);
    });
    it('should return true if both arguments are empty arrays', function () {
        expect((0, fastArrayCompare_1.fastArrayCompare)([], [])).to.equal(true);
    });
});
