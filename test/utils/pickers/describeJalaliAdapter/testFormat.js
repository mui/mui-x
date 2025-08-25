"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFormat = void 0;
var testFormat = function (_a) {
    var adapter = _a.adapter;
    it('should format the seconds without leading zeroes for format "s"', function () {
        var date = adapter.date('2020-01-01T23:44:09.000Z');
        // Should be either ۹ or 9 depending on the config of the adapter.
        expect(adapter.formatByString(date, 's').replace('9', '۹')).to.equal('۹');
    });
};
exports.testFormat = testFormat;
