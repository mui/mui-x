"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFormat = void 0;
var expectedWeekdayShortFormat = function (adapterLib) {
    switch (adapterLib) {
        case 'luxon':
            return 'W';
        case 'moment':
            return 'Wed';
        default:
            return 'We';
    }
};
var testFormat = function (_a) {
    var adapter = _a.adapter;
    var expectDate = function (format, expected) {
        var date = adapter.date('2020-01-01T23:44:00.000Z');
        var result = adapter.format(date, format);
        expect(result).to.equal(expected);
    };
    it('should correctly format standalone hardcoded formats', function () {
        expectDate('normalDate', '1 January');
        expectDate('normalDateWithWeekday', 'Wed, Jan 1');
        expectDate('shortDate', 'Jan 1');
        expectDate('year', '2020');
        expectDate('month', 'January');
        expectDate('weekday', 'Wednesday');
        expectDate('weekdayShort', expectedWeekdayShortFormat(adapter.lib));
        expectDate('dayOfMonth', '1');
        expectDate('fullTime12h', '11:44 PM');
        expectDate('fullTime24h', '23:44');
        expectDate('hours12h', '11');
        expectDate('hours24h', '23');
        expectDate('minutes', '44');
        expectDate('seconds', '00');
    });
    it('should format the seconds without leading zeroes for format "s"', function () {
        var date = adapter.date('2020-01-01T23:44:09.000Z');
        expect(adapter.formatByString(date, 's')).to.equal('9');
    });
};
exports.testFormat = testFormat;
