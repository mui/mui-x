"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var date_utils_1 = require("./date-utils");
describe('findClosestEnabledDate', function () {
    var day18thText = pickers_1.adapterToUse.format(pickers_1.adapterToUse.date('2018-08-18'), 'dayOfMonth');
    var only18th = function (date) { return pickers_1.adapterToUse.format(date, 'dayOfMonth') !== day18thText; };
    it('should return null if all dates are disabled', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('1999-01-01'), // Use close-by min/max dates to reduce the test runtime.
            maxDate: pickers_1.adapterToUse.date('2001-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: function () { return true; },
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).to.equal(null);
    });
    it('should return given date if it is enabled', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: function () { return false; },
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2000-01-01'));
    });
    it('should return next 18th going from 10th', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2018-08-10'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-08-18'));
    });
    it('should return previous 18th going from 1st', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2018-08-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-07-18'));
    });
    it('should return future 18th if disablePast', function () {
        var today = pickers_1.adapterToUse.startOfDay(pickers_1.adapterToUse.date());
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: true,
            timezone: 'default',
        });
        expect(pickers_1.adapterToUse.isBefore(result, today)).to.equal(false);
        expect(pickers_1.adapterToUse.isBefore(result, pickers_1.adapterToUse.addDays(today, 31))).to.equal(true);
    });
    it('should return now if disablePast+disableFuture and now is valid', function () {
        var today = pickers_1.adapterToUse.startOfDay(pickers_1.adapterToUse.date());
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: function () { return false; },
            disableFuture: true,
            disablePast: true,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(today);
    });
    describe('fake clock', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date('2000-01-02'));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should return now with given time part if disablePast and now is valid', function () {
            var tryDate = pickers_1.adapterToUse.date('2000-01-01T11:12:13');
            var result = (0, date_utils_1.findClosestEnabledDate)({
                date: tryDate,
                minDate: pickers_1.adapterToUse.date('1900-01-01'),
                maxDate: pickers_1.adapterToUse.date('2100-01-01'),
                adapter: pickers_1.adapterToUse,
                isDateDisabled: function () { return false; },
                disableFuture: false,
                disablePast: true,
                timezone: 'default',
            });
            expect(result).toEqualDateTime(pickers_1.adapterToUse.addDays(tryDate, 1));
        });
    });
    it('should return `null` when disablePast+disableFuture and now is invalid', function () {
        var today = pickers_1.adapterToUse.date();
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: function (date) { return pickers_1.adapterToUse.isSameDay(date, today); },
            disableFuture: true,
            disablePast: true,
            timezone: 'default',
        });
        expect(result).to.equal(null);
    });
    it('should return minDate if it is after the date and valid', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('2018-08-18'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-08-18'));
    });
    it('should return next 18th after minDate', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('2018-08-01'),
            maxDate: pickers_1.adapterToUse.date('2100-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-08-18'));
    });
    describe('fake clock hours', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date('2000-01-02T11:12:13.123Z'));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should keep the time of the `date` when `disablePast`', function () {
            var result = (0, date_utils_1.findClosestEnabledDate)({
                date: pickers_1.adapterToUse.date('2000-01-01T11:12:13.550Z'),
                minDate: pickers_1.adapterToUse.date('1900-01-01'),
                maxDate: pickers_1.adapterToUse.date('2100-01-01'),
                adapter: pickers_1.adapterToUse,
                isDateDisabled: function () { return false; },
                disableFuture: false,
                disablePast: true,
                timezone: 'default',
            });
            expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2000-01-02T11:12:13.550Z'));
        });
    });
    it('should return maxDate if it is before the date and valid', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2050-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2018-07-18'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-07-18'));
    });
    it('should return previous 18th before maxDate', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2050-01-01'),
            minDate: pickers_1.adapterToUse.date('1900-01-01'),
            maxDate: pickers_1.adapterToUse.date('2018-08-17'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: only18th,
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).toEqualDateTime(pickers_1.adapterToUse.date('2018-07-18'));
    });
    it('should return null if minDate is after maxDate', function () {
        var result = (0, date_utils_1.findClosestEnabledDate)({
            date: pickers_1.adapterToUse.date('2000-01-01'),
            minDate: pickers_1.adapterToUse.date('2000-01-01'),
            maxDate: pickers_1.adapterToUse.date('1999-01-01'),
            adapter: pickers_1.adapterToUse,
            isDateDisabled: function () { return false; },
            disableFuture: false,
            disablePast: false,
            timezone: 'default',
        });
        expect(result).to.equal(null);
    });
});
