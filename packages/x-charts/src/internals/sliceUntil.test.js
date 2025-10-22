"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sliceUntil_1 = require("./sliceUntil");
describe('sliceUntil', function () {
    it('slices ASCII properly', function () {
        expect((0, sliceUntil_1.sliceUntil)('Hello World', 5)).to.equal('Hello');
        expect((0, sliceUntil_1.sliceUntil)('Hello World', 6)).to.equal('Hello ');
        expect((0, sliceUntil_1.sliceUntil)('Hello World', 7)).to.equal('Hello W');
        expect((0, sliceUntil_1.sliceUntil)('Hello World', 9)).to.equal('Hello Wor');
    });
    it('slices unicode characters properly', function () {
        expect((0, sliceUntil_1.sliceUntil)('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 5)).to.equal('emoji');
        expect((0, sliceUntil_1.sliceUntil)('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 6)).to.equal('emoji👱🏽‍♀️');
        expect((0, sliceUntil_1.sliceUntil)('emoji👱🏽‍♀️👱🏽‍♀️👱🏽‍♀️', 7)).to.equal('emoji👱🏽‍♀️👱🏽‍♀️');
    });
});
