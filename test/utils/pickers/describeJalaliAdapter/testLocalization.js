"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLocalization = void 0;
var testLocalization = function (_a) {
    var adapter = _a.adapter;
    it('Method: formatNumber', function () {
        expect(adapter.formatNumber('1')).to.equal('۱');
        expect(adapter.formatNumber('2')).to.equal('۲');
    });
    it('Method: getCurrentLocaleCode', function () {
        // Returns the default locale
        expect(adapter.getCurrentLocaleCode()).to.match(/fa/);
    });
};
exports.testLocalization = testLocalization;
