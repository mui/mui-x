"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var getAdapter_1 = require("./adapter/getAdapter");
var date_utils_1 = require("./date-utils");
describe('date-utils', function () {
    var adapter = (0, getAdapter_1.getAdapter)();
    describe('mergeDateAndTime', function () {
        it('merges hour/minute/second/ms from timeParam into dateParam', function () {
            var date = luxon_1.DateTime.fromISO('2025-03-10T00:00:00Z');
            var time = luxon_1.DateTime.fromISO('2024-12-25T13:45:27.123Z');
            var merged = (0, date_utils_1.mergeDateAndTime)(adapter, date, time);
            expect(adapter.getYear(merged)).to.equal(2025);
            expect(adapter.getMonth(merged)).to.equal(2);
            expect(adapter.getDate(merged)).to.equal(10);
            expect(adapter.getHours(merged)).to.equal(13);
            expect(adapter.getMinutes(merged)).to.equal(45);
            expect(adapter.getSeconds(merged)).to.equal(27);
            expect(adapter.getMilliseconds(merged)).to.equal(123);
        });
    });
    describe('isWeekend', function () {
        it('returns false for weekday (e.g. Wednesday)', function () {
            var wed = luxon_1.DateTime.fromISO('2025-01-08T12:00:00Z');
            expect((0, date_utils_1.isWeekend)(adapter, wed)).to.equal(false);
        });
        it('returns true for Saturday or Sunday', function () {
            var sat = luxon_1.DateTime.fromISO('2025-01-11T12:00:00Z');
            expect((0, date_utils_1.isWeekend)(adapter, sat)).to.equal(true);
            var sun = luxon_1.DateTime.fromISO('2025-01-12T12:00:00Z');
            expect((0, date_utils_1.isWeekend)(adapter, sun)).to.equal(true);
        });
    });
    describe('diffIn', function () {
        describe('minutes', function () {
            it('returns whole-minute difference for same-hour timestamps (floored)', function () {
                var later = luxon_1.DateTime.fromISO('2025-04-10T10:45:30Z');
                var earlier = luxon_1.DateTime.fromISO('2025-04-10T10:00:10Z');
                // 45m 20s -> 45
                expect((0, date_utils_1.diffIn)(adapter, later, earlier, 'minutes')).to.equal(45);
            });
            it('returns negative value when first date is earlier than second', function () {
                var earlier = luxon_1.DateTime.fromISO('2025-04-10T10:00:10Z');
                var later = luxon_1.DateTime.fromISO('2025-04-10T10:45:30Z');
                // -45m 20s -> -46 after floor
                expect((0, date_utils_1.diffIn)(adapter, earlier, later, 'minutes')).to.equal(-46);
            });
            it('returns 0 when both instants are identical', function () {
                var t = luxon_1.DateTime.fromISO('2025-04-10T10:45:30Z');
                expect((0, date_utils_1.diffIn)(adapter, t, t, 'minutes')).to.equal(0);
            });
        });
        describe('days', function () {
            it('ignores time-of-day and compares calendar dates only (end of day vs start of day)', function () {
                var endOf = luxon_1.DateTime.fromISO('2025-02-15T23:59:59Z');
                var startOf = luxon_1.DateTime.fromISO('2025-02-10T00:00:01Z');
                // Calendar span: 10 -> 15 = 5 days
                expect((0, date_utils_1.diffIn)(adapter, endOf, startOf, 'days')).to.equal(5);
            });
            it('handles month boundary correctly (Feb to Mar)', function () {
                var a = luxon_1.DateTime.fromISO('2025-03-02T05:00:00Z');
                var b = luxon_1.DateTime.fromISO('2025-02-27T18:00:00Z');
                // 27 -> 28 -> 1 -> 2 = 3
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'days')).to.equal(3);
            });
            it('returns negative days when order is reversed', function () {
                var earlier = luxon_1.DateTime.fromISO('2025-03-02T12:00:00Z');
                var later = luxon_1.DateTime.fromISO('2025-03-05T01:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, earlier, later, 'days')).to.equal(-3);
            });
        });
        describe('weeks', function () {
            it('computes whole-week difference based on startOfWeek alignment', function () {
                var week3 = luxon_1.DateTime.fromISO('2025-01-18T09:00:00Z');
                var week1 = luxon_1.DateTime.fromISO('2025-01-03T09:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, week3, week1, 'weeks')).to.equal(2);
            });
            it('returns 0 for dates inside the same calendar week', function () {
                var monday = luxon_1.DateTime.fromISO('2025-01-06T08:00:00Z');
                var friday = luxon_1.DateTime.fromISO('2025-01-10T18:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, friday, monday, 'weeks')).to.equal(0);
            });
            it('returns negative when first date is in an earlier week', function () {
                var earlierWeek = luxon_1.DateTime.fromISO('2025-01-06T12:00:00Z');
                var laterWeek = luxon_1.DateTime.fromISO('2025-01-27T12:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, earlierWeek, laterWeek, 'weeks')).to.equal(-3);
            });
        });
        describe('months', function () {
            it('computes difference across year boundary', function () {
                var a = luxon_1.DateTime.fromISO('2026-03-10T00:00:00Z');
                var b = luxon_1.DateTime.fromISO('2025-12-10T00:00:00Z');
                // Dec(2025) -> Mar(2026) = 3
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'months')).to.equal(3);
            });
            it('returns negative for earlier month', function () {
                var earlierMonth = luxon_1.DateTime.fromISO('2025-05-01T00:00:00Z');
                var laterMonth = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, earlierMonth, laterMonth, 'months')).to.equal(-2);
            });
            it('returns 0 for same month regardless of day/time', function () {
                var a = luxon_1.DateTime.fromISO('2025-07-31T23:59:59Z');
                var b = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'months')).to.equal(0);
            });
        });
        describe('years', function () {
            it('returns positive difference across multiple years', function () {
                var a = luxon_1.DateTime.fromISO('2030-05-01T00:00:00Z');
                var b = luxon_1.DateTime.fromISO('2025-05-01T00:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'years')).to.equal(5);
            });
            it('returns negative difference when first date is earlier', function () {
                var a = luxon_1.DateTime.fromISO('2022-12-31T23:59:59Z');
                var b = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'years')).to.equal(-3);
            });
            it('returns 0 for dates within the same calendar year', function () {
                var a = luxon_1.DateTime.fromISO('2025-12-31T23:59:59Z');
                var b = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
                expect((0, date_utils_1.diffIn)(adapter, a, b, 'years')).to.equal(0);
            });
        });
    });
});
