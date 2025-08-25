"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFormat = void 0;
var testFormat = function (_a) {
    var adapter = _a.adapter;
    it('should format the seconds without leading zeroes for format "s"', function () {
        var date = adapter.date('2020-01-01T23:44:09.000Z');
        expect(adapter.formatByString(date, 's')).to.equal('٩');
    });
};
exports.testFormat = testFormat;
