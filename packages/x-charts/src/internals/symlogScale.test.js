"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symlogScale_1 = require("./symlogScale");
describe('symlogScale', function () {
    describe('copy', function () {
        it('properly copies the `ticks` and `tickFormat` functions', function () {
            var scale = (0, symlogScale_1.scaleSymlog)([0, 60000], [0, 100]);
            var tickNumber = 8;
            var expectedTicks = ['0', '1', '10', '100', '1k', '10k'];
            expect(scale
                .ticks(tickNumber)
                .map(scale.tickFormat(tickNumber))
                .filter(function (s) { return s !== ''; })).to.deep.equal(expectedTicks);
            var scaleCopy = scale.copy();
            expect(scale
                .ticks(tickNumber)
                .map(scaleCopy.tickFormat(tickNumber))
                .filter(function (s) { return s !== ''; })).to.deep.equal(expectedTicks);
        });
    });
});
