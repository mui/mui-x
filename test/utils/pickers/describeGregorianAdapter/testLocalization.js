"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLocalization = void 0;
var pickers_1 = require("test/utils/pickers");
var moment_1 = require("moment");
var describeGregorianAdapter_utils_1 = require("./describeGregorianAdapter.utils");
var testLocalization = function (_a) {
    var adapter = _a.adapter;
    var testDateIso = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING);
    it('Method: formatNumber', function () {
        expect(adapter.formatNumber('1')).to.equal('1');
    });
    it('Method: expandFormat', function () {
        var testFormat = function (formatKey) {
            var formatString = adapter.formats[formatKey];
            var expandedFormat = (0, pickers_1.cleanText)(adapter.expandFormat(formatString));
            if (expandedFormat === formatString ||
                (adapter.lib === 'luxon' && formatString === 'ccccc')) {
                // Luxon format 'ccccc' is not supported by the field components since multiple day can have the same one-letter value (for example: Tuesday and Thursday).
                // It is used in the calendar header to display the day of the weeks.
                // Format 'ccccc' is not supported for the field fomrat since multiple day can have the same short
                // It's used to display calendar days.
                return;
            }
            // The expanded format should be fully expanded
            expect((0, pickers_1.cleanText)(adapter.expandFormat(expandedFormat))).to.equal(expandedFormat);
            // Both format should be equivalent
            expect((0, pickers_1.cleanText)(adapter.formatByString(testDateIso, expandedFormat))).to.equal((0, pickers_1.cleanText)(adapter.format(testDateIso, formatKey)));
        };
        Object.keys(adapter.formats).forEach(function (formatKey) {
            testFormat(formatKey);
        });
    });
    it('Method: getCurrentLocaleCode', function () {
        if (adapter.lib === 'moment') {
            moment_1.default.locale('en');
        }
        // Returns the default locale
        expect(adapter.getCurrentLocaleCode()).to.match(/en/);
    });
};
exports.testLocalization = testLocalization;
