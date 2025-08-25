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
        expect(adapter.parse('', 'iYYYY/iM/iD')).to.equal(null);
        expect(adapter.parse('01/01/1395', 'iYYYY/iM/iD')).not.to.equal(null);
    });
    it('Method: isEqual', function () {
        var anotherDate = adapter.date(describeGregorianAdapter_1.TEST_DATE_ISO_STRING);
        expect(adapter.isEqual(testDateIso, anotherDate)).to.equal(true);
        expect(adapter.isEqual(null, null)).to.equal(true);
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
    it('Method: startOfYear', function () {
        expect(adapter.startOfYear(testDateIso)).toEqualDateTime('2018-09-11T00:00:00.000Z');
    });
    it('Method: startOfWeek', function () {
        expect(adapter.startOfWeek(testDateIso)).toEqualDateTime('2018-10-28T00:00:00.000Z');
    });
    it('Method: startOfDay', function () {
        expect(adapter.startOfDay(testDateIso)).toEqualDateTime('2018-10-30T00:00:00.000Z');
    });
    it('Method: startOfMonth', function () {
        expect(adapter.startOfMonth(testDateIso)).toEqualDateTime('2018-10-10T00:00:00.000Z');
    });
    it('Method: endOfYear', function () {
        expect(adapter.endOfYear(testDateIso)).toEqualDateTime('2019-08-30T23:59:59.999Z');
    });
    it('Method: endOfMonth', function () {
        expect(adapter.endOfMonth(testDateIso)).toEqualDateTime('2018-11-08T23:59:59.999Z');
    });
    it('Method: endOfWeek', function () {
        expect(adapter.endOfWeek(testDateIso)).toEqualDateTime('2018-11-03T23:59:59.999Z');
    });
    it('Method: endOfDay', function () {
        expect(adapter.endOfDay(testDateIso)).toEqualDateTime('2018-10-30T23:59:59.999Z');
    });
    it('Method: addYears', function () {
        expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-08T11:44:00.000Z');
        expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-11-21T11:44:00.000Z');
    });
    it('Method: addMonths', function () {
        expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-28T11:44:00.000Z');
        expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-09-01T11:44:00.000Z');
        expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-27T11:44:00.000Z');
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
        expect(adapter.getYear(testDateIso)).to.equal(1440);
    });
    it('Method: getMonth', function () {
        expect(adapter.getMonth(testDateIso)).to.equal(1);
    });
    it('Method: getDate', function () {
        expect(adapter.getDate(testDateIso)).to.equal(21);
    });
    it('Method: setYear', function () {
        expect(adapter.setYear(testDateIso, 1441)).toEqualDateTime('2019-10-20T11:44:00.000Z');
    });
    it('Method: setMonth', function () {
        expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2019-01-27T11:44:00.000Z');
    });
    it('Method: setDate', function () {
        expect(adapter.setDate(testDateIso, 22)).toEqualDateTime('2018-10-31T11:44:00.000Z');
    });
    it('Method: getWeekArray', function () {
        var weekArray = adapter.getWeekArray(testDateIso);
        var expectedDate = new Date('2018-10-07T00:00:00.000Z');
        weekArray.forEach(function (week) {
            week.forEach(function (day) {
                expect(day).toEqualDateTime(expectedDate);
                expectedDate.setDate(expectedDate.getDate() + 1);
            });
        });
    });
    it('Method: getWeekNumber', function () {
        expect(adapter.getWeekNumber(testDateIso)).to.equal(8);
    });
    describe('Method: getYearRange', function () {
        it('Minimum limit', function () {
            var anotherYear = adapter.setYear(testDateIso, 1355);
            expect(function () { return adapter.getYearRange([anotherYear, testDateIso]); }).to.throw('min date must be on or after 1356-01-01 H (1937-03-14)');
        });
        it('Maximum limit', function () {
            var anotherYear = adapter.setYear(testDateIso, 1500);
            expect(function () { return adapter.getYearRange([testDateIso, anotherYear]); }).to.throw('max date must be on or before 1499-12-29 H (2076-11-26)');
        });
    });
    it('Method: getYearRange', function () {
        var anotherDate = adapter.setYear(testDateIso, 1445);
        var yearRange = adapter.getYearRange([testDateIso, anotherDate]);
        expect(yearRange).to.have.length(6);
    });
};
exports.testCalculations = testCalculations;
