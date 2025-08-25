"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCalculations = void 0;
var describeGregorianAdapter_1 = require("../describeGregorianAdapter");
var testCalculations = function (_a) {
    var adapter = _a.adapter;
    var testDateIso = adapter.date(describeGregorianAdapter_1.TEST_DATE_ISO_STRING);
    it('Method: date', function () {
        expect(adapter.date(null)).to.equal(null);
    });
    it('Method: parse', function () {
        expect(adapter.parse('', adapter.formats.keyboardDate)).to.equal(null);
        expect(adapter.parse('01/01/1395', adapter.formats.keyboardDate)).not.to.equal(null);
    });
    it('Method: isEqual', function () {
        var anotherDate = adapter.date(describeGregorianAdapter_1.TEST_DATE_ISO_STRING);
        expect(adapter.isEqual(testDateIso, anotherDate)).to.equal(true);
        expect(adapter.isEqual(null, null)).to.equal(true);
        expect(adapter.isEqual(testDateIso, null)).to.equal(false);
    });
    it('Method: isValid', function () {
        expect(adapter.isValid(testDateIso)).to.equal(true);
        expect(adapter.isValid(null)).to.equal(false);
        if (adapter.lib !== 'moment-jalaali') {
            expect(adapter.isValid(adapter.date('invalid'))).to.equal(false);
        }
        else {
            expect(function () { return adapter.isValid(adapter.date('invalid')); }).toWarnDev('Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not rel');
        }
    });
    it('Method: isSameYear', function () {
        expect(adapter.isSameYear(testDateIso, adapter.date('2018-10-01T00:00:00.000Z'))).to.equal(true);
        expect(adapter.isSameYear(testDateIso, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
    });
    it('Method: isSameMonth', function () {
        expect(adapter.isSameMonth(testDateIso, adapter.date('2018-11-04T00:00:00.000Z'))).to.equal(true);
        expect(adapter.isSameMonth(testDateIso, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
    });
    it('Method: isSameDay', function () {
        expect(adapter.isSameDay(testDateIso, adapter.date('2018-10-30T00:00:00.000Z'))).to.equal(true);
        expect(adapter.isSameDay(testDateIso, adapter.date('2019-10-30T00:00:00.000Z'))).to.equal(false);
    });
    it('Method: isSameHour', function () {
        expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T11:00:00.000Z'))).to.equal(true);
        expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T12:00:00.000Z'))).to.equal(false);
    });
    it('Method: isAfter', function () {
        expect(adapter.isAfter(adapter.date(), testDateIso)).to.equal(true);
        expect(adapter.isAfter(testDateIso, adapter.date())).to.equal(false);
    });
    it('Method: isAfterYear', function () {
        var afterYear = adapter.addYears(testDateIso, 2);
        expect(adapter.isAfterYear(afterYear, testDateIso)).to.equal(true);
    });
    it('Method: isAfterDay', function () {
        var nextDayIso = adapter.addDays(testDateIso, 1);
        expect(adapter.isAfterDay(nextDayIso, testDateIso)).to.equal(true);
        expect(adapter.isAfterDay(testDateIso, nextDayIso)).to.equal(false);
    });
    it('Method: isBefore', function () {
        expect(adapter.isBefore(testDateIso, adapter.date())).to.equal(true);
        expect(adapter.isBefore(adapter.date(), testDateIso)).to.equal(false);
    });
    it('Method: isBeforeYear', function () {
        var afterYear = adapter.addYears(testDateIso, 2);
        expect(adapter.isBeforeYear(testDateIso, afterYear)).to.equal(true);
    });
    it('Method: isBeforeDay', function () {
        var nextDayIso = adapter.addDays(testDateIso, -1);
        expect(adapter.isBeforeDay(nextDayIso, testDateIso)).to.equal(true);
        expect(adapter.isBeforeDay(testDateIso, nextDayIso)).to.equal(false);
    });
    it('Method: isWithinRange', function () {
        expect(adapter.isWithinRange(adapter.date('2019-10-01T00:00:00.000Z'), [
            adapter.date('2019-09-01T00:00:00.000Z'),
            adapter.date('2019-11-01T00:00:00.000Z'),
        ])).to.equal(true);
        expect(adapter.isWithinRange(adapter.date('2019-12-01T00:00:00.000Z'), [
            adapter.date('2019-09-01T00:00:00.000Z'),
            adapter.date('2019-11-01T00:00:00.000Z'),
        ])).to.equal(false);
        expect(adapter.isWithinRange(adapter.date('2019-10-01'), [
            adapter.date('2019-09-01'),
            adapter.date('2019-11-01'),
        ])).to.equal(true);
        expect(adapter.isWithinRange(adapter.date('2019-12-01'), [
            adapter.date('2019-09-01'),
            adapter.date('2019-11-01'),
        ])).to.equal(false);
    });
    it('Method: startOfYear', function () {
        expect(adapter.startOfYear(testDateIso)).toEqualDateTime('2018-03-21T00:00:00.000Z');
    });
    it('Method: startOfMonth', function () {
        expect(adapter.startOfMonth(testDateIso)).toEqualDateTime('2018-10-23T00:00:00.000Z');
    });
    it('Method: startOfWeek', function () {
        expect(adapter.startOfWeek(testDateIso)).toEqualDateTime('2018-10-27T00:00:00.000Z');
    });
    it('Method: startOfDay', function () {
        expect(adapter.startOfDay(testDateIso)).toEqualDateTime('2018-10-30T00:00:00.000Z');
    });
    it('Method: endOfYear', function () {
        expect(adapter.endOfYear(testDateIso)).toEqualDateTime('2019-03-20T23:59:59.999Z');
    });
    it('Method: endOfMonth', function () {
        expect(adapter.endOfMonth(testDateIso)).toEqualDateTime('2018-11-21T23:59:59.999Z');
    });
    it('Method: endOfWeek', function () {
        expect(adapter.endOfWeek(testDateIso)).toEqualDateTime('2018-11-02T23:59:59.999Z');
    });
    it('Method: endOfDay', function () {
        expect(adapter.endOfDay(testDateIso)).toEqualDateTime('2018-10-30T23:59:59.999Z');
    });
    it('Method: addYears', function () {
        expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-29T11:44:00.000Z');
        expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-10-29T11:44:00.000Z');
    });
    it('Method: addMonths', function () {
        expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-29T11:44:00.000Z');
        expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-08-30T11:44:00.000Z');
        expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-28T11:44:00.000Z');
    });
    it('Method: addWeeks', function () {
        expect(adapter.addWeeks(testDateIso, 2)).toEqualDateTime('2018-11-13T11:44:00.000Z');
        expect(adapter.addWeeks(testDateIso, -2)).toEqualDateTime('2018-10-16T11:44:00.000Z');
    });
    it('Method: addDays', function () {
        expect(adapter.addDays(testDateIso, 2)).toEqualDateTime('2018-11-01T11:44:00.000Z');
        expect(adapter.addDays(testDateIso, -2)).toEqualDateTime('2018-10-28T11:44:00.000Z');
    });
    it('Method: addHours', function () {
        expect(adapter.addHours(testDateIso, 2)).toEqualDateTime('2018-10-30T13:44:00.000Z');
        expect(adapter.addHours(testDateIso, -2)).toEqualDateTime('2018-10-30T09:44:00.000Z');
        expect(adapter.addHours(testDateIso, 15)).toEqualDateTime('2018-10-31T02:44:00.000Z');
    });
    it('Method: addMinutes', function () {
        expect(adapter.addMinutes(testDateIso, 2)).toEqualDateTime('2018-10-30T11:46:00.000Z');
        expect(adapter.addMinutes(testDateIso, -2)).toEqualDateTime('2018-10-30T11:42:00.000Z');
        expect(adapter.addMinutes(testDateIso, 20)).toEqualDateTime('2018-10-30T12:04:00.000Z');
    });
    it('Method: addSeconds', function () {
        expect(adapter.addSeconds(testDateIso, 2)).toEqualDateTime('2018-10-30T11:44:02.000Z');
        expect(adapter.addSeconds(testDateIso, -2)).toEqualDateTime('2018-10-30T11:43:58.000Z');
        expect(adapter.addSeconds(testDateIso, 70)).toEqualDateTime('2018-10-30T11:45:10.000Z');
    });
    it('Method: getYear', function () {
        expect(adapter.getYear(testDateIso)).to.equal(1397);
    });
    it('Method: getMonth', function () {
        expect(adapter.getMonth(testDateIso)).to.equal(7);
    });
    it('Method: getDate', function () {
        expect(adapter.getDate(testDateIso)).to.equal(8);
    });
    it('Method: getHours', function () {
        expect(adapter.getHours(testDateIso)).to.equal(11);
    });
    it('Method: getMinutes', function () {
        expect(adapter.getMinutes(testDateIso)).to.equal(44);
    });
    it('Method: getSeconds', function () {
        expect(adapter.getSeconds(testDateIso)).to.equal(0);
    });
    it('Method: getMilliseconds', function () {
        expect(adapter.getMilliseconds(testDateIso)).to.equal(0);
    });
    it('Method: setYear', function () {
        expect(adapter.setYear(testDateIso, 1398)).toEqualDateTime('2019-10-30T11:44:00.000Z');
    });
    it('Method: setMonth', function () {
        expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2018-07-30T11:44:00.000Z');
    });
    it('Method: setDate', function () {
        expect(adapter.setDate(testDateIso, 9)).toEqualDateTime('2018-10-31T11:44:00.000Z');
    });
    it('Method: setHours', function () {
        expect(adapter.setHours(testDateIso, 0)).toEqualDateTime('2018-10-30T00:44:00.000Z');
    });
    it('Method: setMinutes', function () {
        expect(adapter.setMinutes(testDateIso, 12)).toEqualDateTime('2018-10-30T11:12:00.000Z');
    });
    it('Method: setSeconds', function () {
        expect(adapter.setSeconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:11.000Z');
    });
    it('Method: setMilliseconds', function () {
        expect(adapter.setMilliseconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:00.011Z');
    });
    it('Method: getDaysInMonth', function () {
        expect(adapter.getDaysInMonth(testDateIso)).to.equal(30);
    });
    it('Method: getWeekArray', function () {
        var weekArray = adapter.getWeekArray(testDateIso);
        var expectedDate = new Date('2018-10-20T00:00:00.000Z');
        weekArray.forEach(function (week) {
            week.forEach(function (day) {
                expect(day).toEqualDateTime(expectedDate);
                expectedDate.setDate(expectedDate.getDate() + 1);
            });
        });
    });
    it('Method: getWeekNumber', function () {
        expect(adapter.getWeekNumber(testDateIso)).to.equal(33);
    });
    it('Method: getYearRange', function () {
        var anotherDate = adapter.setYear(testDateIso, 1400);
        var yearRange = adapter.getYearRange([testDateIso, anotherDate]);
        expect(yearRange).to.have.length(4);
    });
};
exports.testCalculations = testCalculations;
