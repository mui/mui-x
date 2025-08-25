"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var recurrence_utils_1 = require("./recurrence-utils");
var getAdapter_1 = require("./adapter/getAdapter");
var date_utils_1 = require("./date-utils");
describe('recurrence-utils', function () {
    var adapter = (0, getAdapter_1.getAdapter)();
    describe('getByDayMaps', function () {
        var ISO_ADAPTER = {
            date: function (value) { return luxon_1.DateTime.fromISO(value); },
            addDays: function (d, n) { return d.plus({ days: n }); },
            getDayOfWeek: function (d) { return d.weekday; },
        };
        var SUNDAY_FIRST_ADAPTER = {
            date: function (value) { return luxon_1.DateTime.fromISO(value); },
            addDays: function (d, n) { return d.plus({ days: n }); },
            getDayOfWeek: function (d) { return (d.weekday === 7 ? 1 : d.weekday + 1); },
        };
        var ALL_CODES = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
        it('respects ISO Mon=1 numbering', function () {
            var _a = (0, recurrence_utils_1.getByDayMaps)(ISO_ADAPTER), byDayToNum = _a.byDayToNum, numToByDay = _a.numToByDay;
            expect(byDayToNum.MO).to.equal(1);
            expect(byDayToNum.SU).to.equal(7);
            expect(Object.values(byDayToNum)).to.have.length(7);
            expect(Object.keys(numToByDay)).to.have.length(7);
            ALL_CODES.forEach(function (code) {
                expect(numToByDay[byDayToNum[code]]).to.equal(code);
            });
        });
        it('respects Sunday=1 numbering', function () {
            var _a = (0, recurrence_utils_1.getByDayMaps)(SUNDAY_FIRST_ADAPTER), byDayToNum = _a.byDayToNum, numToByDay = _a.numToByDay;
            expect(byDayToNum.SU).to.equal(1);
            expect(byDayToNum.MO).to.equal(2);
            expect(Object.values(byDayToNum)).to.have.length(7);
            expect(Object.keys(numToByDay)).to.have.length(7);
            ALL_CODES.forEach(function (code) {
                expect(numToByDay[byDayToNum[code]]).to.equal(code);
            });
        });
    });
    describe('buildRecurrencePresets', function () {
        it('returns daily, weekly, monthly and yearly presets', function () {
            var start = luxon_1.DateTime.fromISO('2025-08-05T09:00:00Z'); // Tuesday
            var presets = (0, recurrence_utils_1.buildRecurrencePresets)(adapter, start);
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            expect(presets.daily).to.deep.equal({
                freq: 'DAILY',
                interval: 1,
            });
            expect(presets.weekly).to.deep.equal({
                freq: 'WEEKLY',
                interval: 1,
                byDay: [numToByDay[adapter.getDayOfWeek(start)]],
            });
            expect(presets.monthly).to.deep.equal({
                freq: 'MONTHLY',
                interval: 1,
                byMonthDay: [5],
            });
            expect(presets.yearly).to.deep.equal({
                freq: 'YEARLY',
                interval: 1,
            });
        });
    });
    describe('detectRecurrenceKeyFromRule', function () {
        var start = luxon_1.DateTime.fromISO('2025-08-05T09:00:00'); // Tuesday
        var presets = (0, recurrence_utils_1.buildRecurrencePresets)(adapter, start);
        it('returns null when rule undefined', function () {
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, undefined, start)).to.equal(null);
        });
        it('detects daily, weekly, monthly and yearly presets', function () {
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, presets.daily, start)).to.equal('daily');
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, presets.weekly, start)).to.equal('weekly');
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, presets.monthly, start)).to.equal('monthly');
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, presets.yearly, start)).to.equal('yearly');
        });
        it('classifies daily interval>1 or with finite end (count) as custom', function () {
            var ruleInterval2 = __assign(__assign({}, presets.daily), { interval: 2 });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, ruleInterval2, start)).to.equal('custom');
            var ruleFiniteCount = __assign(__assign({}, presets.daily), { count: 5 });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, ruleFiniteCount, start)).to.equal('custom');
        });
        it('classifies weekly with extra day as custom', function () {
            var rule = __assign(__assign({}, presets.weekly), { byDay: ['TU', 'WE'] });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, rule, start)).to.equal('custom');
        });
        it('classifies monthly with different day or with interval>1 as custom', function () {
            var ruleDifferentDay = __assign(__assign({}, presets.monthly), { byMonthDay: [26] });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, ruleDifferentDay, start)).to.equal('custom');
            var ruleInterval2 = __assign(__assign({}, presets.monthly), { interval: 2 });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, ruleInterval2, start)).to.equal('custom');
        });
        it('classifies yearly interval>1 as custom', function () {
            var rule = __assign(__assign({}, presets.yearly), { interval: 2 });
            expect((0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, rule, start)).to.equal('custom');
        });
    });
    describe('getAllDaySpanDays', function () {
        var createEvent = function (overrides) { return (__assign({ id: 'event-1', title: 'Test Event', start: luxon_1.DateTime.fromISO('2025-01-01T09:00:00Z'), end: luxon_1.DateTime.fromISO('2025-01-01T10:00:00Z'), allDay: false }, overrides)); };
        // TODO: This should change after we implement support for timed events that span multiple days
        it('returns 1 for non-allDay multi-day event', function () {
            var event = createEvent({
                end: luxon_1.DateTime.fromISO('2025-01-03T18:00:00Z'),
            });
            expect((0, recurrence_utils_1.getAllDaySpanDays)(adapter, event)).to.equal(1);
        });
        it('returns 1 for allDay event on same calendar day', function () {
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-02-10T00:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-02-10T23:59:59Z'),
                allDay: true,
            });
            expect((0, recurrence_utils_1.getAllDaySpanDays)(adapter, event)).to.equal(1);
        });
        it('returns inclusive day count for allDay multi-day event', function () {
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-04T23:59:59Z'),
                allDay: true,
            });
            // Jan 1,2,3,4 => 4 days
            expect((0, recurrence_utils_1.getAllDaySpanDays)(adapter, event)).to.equal(4);
        });
        it('handles month boundary correctly', function () {
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-30T00:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-02-02T23:59:59Z'),
                allDay: true,
            });
            // Jan 30,31, Feb 1,2 => 4 days
            expect((0, recurrence_utils_1.getAllDaySpanDays)(adapter, event)).to.equal(4);
        });
        it('handles leap day span', function () {
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2024-02-28T00:00:00Z'),
                end: luxon_1.DateTime.fromISO('2024-03-01T23:59:59Z'),
                allDay: true,
            });
            // Feb 28, Feb 29, Mar 1 => 3 days
            expect((0, recurrence_utils_1.getAllDaySpanDays)(adapter, event)).to.equal(3);
        });
    });
    describe('buildEndGuard', function () {
        var baseStart = luxon_1.DateTime.fromISO('2025-01-01T09:00:00Z');
        var createDailyRule = function (overrides) {
            if (overrides === void 0) { overrides = {}; }
            return (__assign({ freq: 'DAILY', interval: 1 }, overrides));
        };
        it('throws when COUNT and UNTIL are both set (RFC 5545)', function () {
            var until = baseStart.plus({ days: 5 });
            var rule = { freq: 'DAILY', interval: 1, count: 10, until: until };
            expect(function () { return (0, recurrence_utils_1.buildEndGuard)(rule, baseStart, adapter); }).to.throw();
        });
        describe('no end (never)', function () {
            it('always returns true when count/until are not set', function () {
                var rule = createDailyRule(); // no count/until
                var guard = (0, recurrence_utils_1.buildEndGuard)(rule, baseStart, adapter);
                expect(guard(baseStart)).to.equal(true);
                expect(guard(baseStart.plus({ days: 30 }))).to.equal(true);
                expect(guard(baseStart.plus({ years: 3 }))).to.equal(true);
            });
        });
        describe('until', function () {
            it('returns true before/on boundary, false after boundary', function () {
                var until = luxon_1.DateTime.fromISO('2025-01-05T09:00:00Z'); // inclusive boundary
                var rule = createDailyRule({ until: until });
                var guard = (0, recurrence_utils_1.buildEndGuard)(rule, baseStart, adapter);
                expect(guard(baseStart)).to.equal(true); // start
                expect(guard(until.minus({ days: 1 }))).to.equal(true); // before boundary
                expect(guard(until)).to.equal(true); // on boundary
                expect(guard(until.plus({ days: 1 }))).to.equal(false); // after
            });
        });
        describe('count', function () {
            it('stops after specified number of occurrences (e.g. 3)', function () {
                var rule = createDailyRule({ count: 3 });
                var guard = (0, recurrence_utils_1.buildEndGuard)(rule, baseStart, adapter);
                // Occurrence dates: Jan 1,2,3. Guard should become false starting with Jan 4.
                var occ1 = baseStart;
                var occ2 = baseStart.plus({ days: 1 });
                var occ3 = baseStart.plus({ days: 2 });
                var after = baseStart.plus({ days: 3 });
                expect(guard(occ1)).to.equal(true);
                expect(guard(occ2)).to.equal(true);
                expect(guard(occ3)).to.equal(true);
                expect(guard(after)).to.equal(false);
            });
            it('returns false after first occurrence when count=1', function () {
                var rule = createDailyRule({ count: 1 });
                var guard = (0, recurrence_utils_1.buildEndGuard)(rule, baseStart, adapter);
                expect(guard(baseStart)).to.equal(true);
                expect(guard(baseStart.plus({ days: 1 }))).to.equal(false);
            });
        });
    });
    describe('matchesRecurrence', function () {
        var baseStart = luxon_1.DateTime.fromISO('2025-01-10T09:30:00Z'); // Friday
        var createEvent = function (start) {
            if (start === void 0) { start = baseStart; }
            return ({
                id: 'event-1',
                title: 'Test Event',
                start: start,
                end: start.plus({ hours: 1 }),
            });
        };
        describe('daily frequency', function () {
            it('returns false for date before series start', function () {
                var event = createEvent();
                var rule = { freq: 'DAILY', interval: 1 };
                var date = baseStart.minus({ days: 1 });
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, date, adapter, event)).to.equal(false);
            });
            it('returns true on start day and respects interval > 1', function () {
                var event = createEvent();
                var rule = { freq: 'DAILY', interval: 2 };
                var day0 = baseStart;
                var day1 = baseStart.plus({ days: 1 });
                var day2 = baseStart.plus({ days: 2 });
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, day0, adapter, event)).to.equal(true);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, day1, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, day2, adapter, event)).to.equal(true);
            });
        });
        describe('weekly frequency', function () {
            it('returns true when the weekday is in byDay', function () {
                var event = createEvent();
                var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
                var code = numToByDay[adapter.getDayOfWeek(event.start)];
                var rule = {
                    freq: 'WEEKLY',
                    interval: 1,
                    byDay: [code],
                };
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, event.start, adapter, event)).to.equal(true);
            });
            it('returns false when the weekday is not in byDay', function () {
                var event = createEvent();
                var rule = {
                    freq: 'WEEKLY',
                    interval: 1,
                    byDay: ['MO'], // Monday
                };
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, event.start, adapter, event)).to.equal(false); // Friday start
            });
            it('interval > 1 (every 2 weeks) includes only correct weeks', function () {
                var event = createEvent(baseStart);
                var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
                var code = numToByDay[adapter.getDayOfWeek(event.start)]; // FR
                var rule = {
                    freq: 'WEEKLY',
                    interval: 2,
                    byDay: [code],
                };
                var sameWeek = baseStart; // included
                var nextWeek = baseStart.plus({ weeks: 1 }); // skipped
                var week2 = baseStart.plus({ weeks: 2 }); // included
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, sameWeek, adapter, event)).to.equal(true);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, nextWeek, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, week2, adapter, event)).to.equal(true);
            });
            it('multiple byDay matches any of them', function () {
                var event = createEvent();
                var rule = {
                    freq: 'WEEKLY',
                    interval: 1,
                    byDay: ['MO', 'TU', 'FR'],
                };
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, event.start, adapter, event)).to.equal(true); // Friday
            });
            it('does not match days before DTSTART within the first week', function () {
                var event = createEvent(baseStart);
                var rule = {
                    freq: 'WEEKLY',
                    interval: 1,
                    byDay: ['MO', 'TU', 'WE', 'TH', 'FR'],
                };
                // same week of DTSTART
                var mon = baseStart.set({ weekday: 1 }); // Mon 2025-01-06
                var tue = baseStart.set({ weekday: 2 }); // Tue 2025-01-07
                var wed = baseStart.set({ weekday: 3 }); // Wed 2025-01-08
                var thu = baseStart.set({ weekday: 4 }); // Thu 2025-01-09
                var fri = baseStart.set({ weekday: 5 }); // Fri 2025-01-10 (DTSTART)
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, mon, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, tue, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, wed, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, thu, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, fri, adapter, event)).to.equal(true);
                var nextMon = baseStart.plus({ weeks: 1 }).set({ weekday: 1 });
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, nextMon, adapter, event)).to.equal(true);
            });
            it('defaults to DTSTART weekday when byDay is omitted', function () {
                var event = createEvent(baseStart);
                var rule = { freq: 'WEEKLY', interval: 1 }; // no byDay
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, baseStart, adapter, event)).to.equal(true); // same friday
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, baseStart.plus({ days: 1 }), adapter, event)).to.equal(false); // saturday
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, baseStart.plus({ weeks: 1 }), adapter, event)).to.equal(true); // next friday
            });
            it('throws an error for ordinal BYDAY values (e.g., 1MO)', function () {
                var event = createEvent();
                var bad = { freq: 'WEEKLY', byDay: ['1MO'] };
                expect(function () { return (0, recurrence_utils_1.matchesRecurrence)(bad, event.start, adapter, event); }).to.throw();
            });
        });
        describe('monthly frequency (byMonthDay)', function () {
            it('returns true on start month/day', function () {
                var event = createEvent();
                var day = adapter.getDate(event.start);
                var rule = {
                    freq: 'MONTHLY',
                    interval: 1,
                    byMonthDay: [day],
                };
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, event.start, adapter, event)).to.equal(true);
            });
            it('interval > 1 (every 2 months) includes only correct months', function () {
                var start = baseStart;
                var event = createEvent(start);
                var rule = {
                    freq: 'MONTHLY',
                    interval: 2,
                    byMonthDay: [adapter.getDate(start)],
                };
                var month1 = start.plus({ months: 1 }); // skipped
                var month2 = start.plus({ months: 2 }); // included
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, month1, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, month2, adapter, event)).to.equal(true);
            });
            it('returns false when day does not match', function () {
                var event = createEvent();
                var rule = {
                    freq: 'MONTHLY',
                    interval: 1,
                    byMonthDay: [25],
                };
                var nextMonthSameOriginalDay = baseStart.plus({ months: 1 });
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, nextMonthSameOriginalDay, adapter, event)).to.equal(false);
            });
            it('falls back to DTSTART day-of-month when byMonthDay is omitted', function () {
                var start = luxon_1.DateTime.fromISO('2025-03-15T09:00:00Z');
                var event = createEvent(start);
                var rule = { freq: 'MONTHLY', interval: 1 }; // no byMonthDay
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, start.plus({ months: 1 }), adapter, event)).to.equal(true); // 15-Apr
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, start.plus({ months: 1, days: 1 }), adapter, event)).to.equal(false);
            });
            it('throws an error for BYDAY (not supported yet)', function () {
                var event = createEvent();
                var rule = { freq: 'MONTHLY', byDay: ['MO'] };
                var nextMonth = event.start.plus({ months: 1 });
                expect(function () { return (0, recurrence_utils_1.matchesRecurrence)(rule, nextMonth, adapter, event); }).to.throw();
            });
        });
        describe('yearly frequency', function () {
            it('returns true on start year', function () {
                var event = createEvent();
                var rule = { freq: 'YEARLY', interval: 1 };
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, event.start, adapter, event)).to.equal(true);
            });
            it('interval > 1 (every 2 years) includes only correct years', function () {
                var start = luxon_1.DateTime.fromISO('2025-03-15T09:00:00Z');
                var event = createEvent(start);
                var rule = { freq: 'YEARLY', interval: 2 };
                var plus1 = start.plus({ years: 1 }); // skipped
                var plus2 = start.plus({ years: 2 }); // included
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, plus1, adapter, event)).to.equal(false);
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, plus2, adapter, event)).to.equal(true);
            });
            it('returns false when day differs despite interval', function () {
                var start = luxon_1.DateTime.fromISO('2025-07-20T09:00:00Z');
                var event = createEvent(start);
                var rule = { freq: 'YEARLY', interval: 1 };
                var diffDay = start.plus({ years: 1 }).plus({ days: 1 });
                expect((0, recurrence_utils_1.matchesRecurrence)(rule, diffDay, adapter, event)).to.equal(false);
            });
            it('yearly throws when BY* selectors are provided', function () {
                var event = createEvent();
                var bad1 = { freq: 'YEARLY', byMonth: [7] };
                var bad2 = { freq: 'YEARLY', byMonthDay: [20] };
                var bad3 = { freq: 'YEARLY', byDay: ['MO'] };
                expect(function () { return (0, recurrence_utils_1.matchesRecurrence)(bad1, event.start, adapter, event); }).to.throw();
                expect(function () { return (0, recurrence_utils_1.matchesRecurrence)(bad2, event.start, adapter, event); }).to.throw();
                expect(function () { return (0, recurrence_utils_1.matchesRecurrence)(bad3, event.start, adapter, event); }).to.throw();
            });
        });
    });
    describe('estimateOccurrencesUpTo', function () {
        var createDailyRule = function (interval) {
            if (interval === void 0) { interval = 1; }
            return ({
                freq: 'DAILY',
                interval: interval,
            });
        };
        it('returns 0 when target is before start', function () {
            var start = luxon_1.DateTime.fromISO('2025-03-10T12:00:00Z');
            var target = luxon_1.DateTime.fromISO('2025-03-09T23:59:59Z');
            expect((0, recurrence_utils_1.estimateOccurrencesUpTo)(adapter, createDailyRule(), start, target)).to.equal(0);
        });
        it('daily interval=1 returns inclusive day span count', function () {
            var start = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var target = luxon_1.DateTime.fromISO('2025-01-05T23:59:59Z'); // 1,2,3,4,5 = 5
            expect((0, recurrence_utils_1.estimateOccurrencesUpTo)(adapter, createDailyRule(), start, target)).to.equal(5);
        });
        it('daily interval=2 counts every other day inclusive', function () {
            var start = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var target = luxon_1.DateTime.fromISO('2025-01-11T00:00:00Z'); // Days: 1,3,5,7,9,11 => 6
            expect((0, recurrence_utils_1.estimateOccurrencesUpTo)(adapter, createDailyRule(2), start, target)).to.equal(6);
        });
        it('throws an error on unknown frequency', function () {
            var badRule = { freq: 'FOO', interval: 1 };
            var start = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var target = luxon_1.DateTime.fromISO('2025-01-02T00:00:00Z');
            expect(function () { return (0, recurrence_utils_1.estimateOccurrencesUpTo)(adapter, badRule, start, target); }).to.throw();
        });
    });
    describe('countWeeklyOccurrencesUpToExact', function () {
        var createRule = function (by, interval) {
            if (interval === void 0) { interval = 1; }
            return ({
                freq: 'WEEKLY',
                interval: interval,
                byDay: by,
            });
        };
        it('returns 0 when target date is before series start', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z'); // Tuesday
            var target = luxon_1.DateTime.fromISO('2025-06-09T23:59:59Z'); // Mon before start
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var code = numToByDay[adapter.getDayOfWeek(start)]; // TU
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule([code]), start, target)).to.equal(0);
        });
        it('counts first occurrence when target is same day', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z'); // Tuesday
            var target = luxon_1.DateTime.fromISO('2025-06-10T23:59:59Z');
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var code = numToByDay[adapter.getDayOfWeek(start)]; // TU
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule([code]), start, target)).to.equal(1);
        });
        it('counts occurrences for a single weekday across several weeks (interval=1)', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z'); // Tuesday
            var target = luxon_1.DateTime.fromISO('2025-07-08T12:00:00Z'); // 5 Tuesdays inclusive
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var code = numToByDay[adapter.getDayOfWeek(start)]; // TU
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule([code]), start, target)).to.equal(5);
        });
        it('counts multiple days per week (e.g. Mon & Wed) up to target inclusive', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-02T09:00:00Z'); // Monday
            var byDay = ['MO', 'WE'];
            var target = luxon_1.DateTime.fromISO('2025-06-18T23:59:59Z'); // includes weeks of Jun 2,9,16
            // Occurrences: Mon(2), Wed(4), Mon(9), Wed(11), Mon(16), Wed(18) = 6
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule(byDay), start, target)).to.equal(6);
        });
        it('respects interval > 1 (every 2 weeks)', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z'); // Tuesday
            var target = luxon_1.DateTime.fromISO('2025-07-22T12:00:00Z');
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var code = numToByDay[adapter.getDayOfWeek(start)]; // TU
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule([code], 2), start, target)).to.equal(4);
        });
        it('does not count weekday in target week occurring after target day', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z'); // Tuesday
            var target = luxon_1.DateTime.fromISO('2025-06-23T12:00:00Z'); // Monday of week containing Tue 24
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var code = numToByDay[adapter.getDayOfWeek(start)]; // TU
            // Occurrences counted: Jun 10, Jun 17 => 2 (Jun 24 excluded)
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule([code]), start, target)).to.equal(2);
        });
        it('handles unordered byDay array', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-02T09:00:00Z'); // Monday
            var byDay = ['FR', 'MO'];
            var target = luxon_1.DateTime.fromISO('2025-06-13T23:59:59Z'); // Mon 2, Fri 6, Mon 9, Fri 13 => 4
            expect((0, recurrence_utils_1.countWeeklyOccurrencesUpToExact)(adapter, createRule(byDay), start, target)).to.equal(4);
        });
    });
    describe('countMonthlyOccurrencesUpToExact', function () {
        describe('byMonthDay', function () {
            var createRule = function (day, interval) {
                if (interval === void 0) { interval = 1; }
                return ({
                    freq: 'MONTHLY',
                    interval: interval,
                    byMonthDay: [day],
                });
            };
            it('returns 0 when target month is before start month', function () {
                var start = luxon_1.DateTime.fromISO('2025-06-10T09:00:00Z');
                var target = luxon_1.DateTime.fromISO('2025-05-31T23:59:59Z');
                expect((0, recurrence_utils_1.countMonthlyOccurrencesUpToExact)(adapter, createRule(10), start, target)).to.equal(0);
            });
            it('counts all byMonthDay occurrences up to inclusive target (interval=1)', function () {
                var start = luxon_1.DateTime.fromISO('2025-01-10T09:00:00Z');
                var target = luxon_1.DateTime.fromISO('2025-04-10T12:00:00Z'); // Jan, Feb, Mar, Apr
                expect((0, recurrence_utils_1.countMonthlyOccurrencesUpToExact)(adapter, createRule(10), start, target)).to.equal(4);
            });
            it('respects interval > 1 (e.g. every 2 months)', function () {
                var start = luxon_1.DateTime.fromISO('2025-01-10T09:00:00Z');
                var target = luxon_1.DateTime.fromISO('2025-11-10T09:00:00Z'); // Jan, Mar, May, Jul, Sep, Nov
                expect((0, recurrence_utils_1.countMonthlyOccurrencesUpToExact)(adapter, createRule(10, 2), start, target)).to.equal(6);
            });
            it('skips months lacking the day (e.g. day 31)', function () {
                var start = luxon_1.DateTime.fromISO('2025-01-31T09:00:00Z');
                var target = luxon_1.DateTime.fromISO('2025-05-31T09:00:00Z'); // Jan(31), Mar(31), May(31)
                expect((0, recurrence_utils_1.countMonthlyOccurrencesUpToExact)(adapter, createRule(31), start, target)).to.equal(3);
            });
            it('does not count occurrence after target day in same month', function () {
                var start = luxon_1.DateTime.fromISO('2025-01-20T09:00:00Z');
                var target = luxon_1.DateTime.fromISO('2025-02-15T09:00:00Z'); // Feb 20 not reached
                expect((0, recurrence_utils_1.countMonthlyOccurrencesUpToExact)(adapter, createRule(20), start, target)).to.equal(1);
            });
        });
        describe('"onWeekday" mode (Nth weekday)', function () {
            // TODO: Issue #19128 Implement via BYDAY ordinals (e.g., '4SA').
        });
        describe('"onLastWeekday" mode (last weekday)', function () {
            // TODO: Issue #19128 Implement via BYDAY ordinals (e.g., '-1SA').
        });
    });
    describe('countYearlyOccurrencesUpToExact', function () {
        var createRule = function (interval) {
            if (interval === void 0) { interval = 1; }
            return ({
                freq: 'YEARLY',
                interval: interval,
            });
        };
        it('returns 0 when target year is before start year', function () {
            var start = luxon_1.DateTime.fromISO('2025-06-10T10:00:00Z');
            var target = luxon_1.DateTime.fromISO('2024-12-31T23:59:59Z');
            expect((0, recurrence_utils_1.countYearlyOccurrencesUpToExact)(adapter, createRule(), start, target)).to.equal(0);
        });
        it('counts first occurrence when target is same calendar day', function () {
            var start = luxon_1.DateTime.fromISO('2025-03-15T08:00:00Z');
            var target = luxon_1.DateTime.fromISO('2025-03-15T23:59:59Z');
            expect((0, recurrence_utils_1.countYearlyOccurrencesUpToExact)(adapter, createRule(), start, target)).to.equal(1);
        });
        it('counts all occurrences up to inclusive target (interval=1)', function () {
            var start = luxon_1.DateTime.fromISO('2023-02-05T09:00:00Z');
            var target = luxon_1.DateTime.fromISO('2026-02-05T09:00:00Z'); // 2023,24,25,26
            expect((0, recurrence_utils_1.countYearlyOccurrencesUpToExact)(adapter, createRule(), start, target)).to.equal(4);
        });
        it('respects interval > 1 (every 2 years)', function () {
            var start = luxon_1.DateTime.fromISO('2022-07-20T09:00:00Z');
            var target = luxon_1.DateTime.fromISO('2030-07-20T09:00:00Z'); // 2022,24,26,28,30
            expect((0, recurrence_utils_1.countYearlyOccurrencesUpToExact)(adapter, createRule(2), start, target)).to.equal(5);
        });
        it('skips non-leap years for Feb 29 start', function () {
            var start = luxon_1.DateTime.fromISO('2024-02-29T10:00:00Z');
            var target = luxon_1.DateTime.fromISO('2032-12-31T23:59:59Z'); // 2024, 2028, 2032
            expect((0, recurrence_utils_1.countYearlyOccurrencesUpToExact)(adapter, createRule(), start, target)).to.equal(3);
        });
    });
    describe('getRecurringEventOccurrencesForVisibleDays', function () {
        var makeDays = function (start, count) {
            return Array.from({ length: count }, function (_, i) { return start.plus({ days: i }); });
        };
        var createEvent = function (overrides) { return (__assign({ id: 'base-event', title: 'Recurring Test Event', start: luxon_1.DateTime.fromISO('2025-01-01T09:00:00Z'), end: luxon_1.DateTime.fromISO('2025-01-01T10:30:00Z'), allDay: false, rrule: {
                freq: 'DAILY',
                interval: 1,
            } }, overrides)); };
        it('generates daily timed occurrences within visible range preserving duration', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-10T00:00:00Z');
            var days = makeDays(visibleStart, 5); // Jan 10-14
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-10T09:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-10T10:30:00Z'),
                rrule: { freq: 'DAILY', interval: 1 },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            expect(result).to.have.length(5);
            for (var i = 0; i < result.length; i += 1) {
                var occ = result[i];
                expect(adapter.format(occ.start, 'keyboardDate')).to.equal(adapter.format(days[i], 'keyboardDate'));
                expect((0, date_utils_1.diffIn)(adapter, occ.end, occ.start, 'minutes')).to.equal(90);
                expect(occ.key).to.equal("".concat(event.id, "::").concat(adapter.format(occ.start, 'keyboardDate')));
            }
        });
        it('includes last day defined by "until" but excludes the following day', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var days = makeDays(visibleStart, 10);
            var until = luxon_1.DateTime.fromISO('2025-01-05T23:59:59Z');
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-01T09:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-01T09:30:00Z'),
                rrule: { freq: 'DAILY', interval: 1, until: until },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            // Jan 1..5 inclusive
            expect(result.map(function (o) { return adapter.getDate(o.start); })).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it('respects "count" end rule (count=3 gives 3 occurrences)', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var days = makeDays(visibleStart, 7);
            var event = createEvent({
                rrule: { freq: 'DAILY', interval: 1, count: 3 },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            expect(result).to.have.length(3);
            expect(result.map(function (o) { return adapter.getDate(o.start); })).to.deep.equal([1, 2, 3]);
        });
        it('applies weekly interval > 1 (e.g. every 2 weeks)', function () {
            var start = luxon_1.DateTime.fromISO('2025-01-03T09:00:00Z'); // Friday
            var days = makeDays(start.startOf('day'), 30);
            var event = createEvent({
                start: start,
                end: start.plus({ minutes: 30 }),
                rrule: { freq: 'WEEKLY', interval: 2 }, // byDay omitted -> defaults to start weekday
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            // Expect Fridays at week 0, 2 and 4
            var dates = result.map(function (o) { return adapter.getDate(o.start); });
            expect(dates).to.deep.equal([3, 17, 31]);
        });
        it('generates monthly byMonthDay occurrences only on matching day and within visible range', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var days = makeDays(visibleStart, 120); // ~4 months
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-10T09:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-10T09:30:00Z'),
                rrule: {
                    freq: 'MONTHLY',
                    interval: 1,
                    byMonthDay: [10],
                },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            var daysOfMonth = result.map(function (o) { return adapter.getDate(o.start); });
            expect(daysOfMonth).to.deep.equal([10, 10, 10, 10]);
        });
        it('generates yearly occurrences with interval', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-01T00:00:00Z');
            var days = makeDays(visibleStart, 365 * 5 + 2); // ~5 years
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-07-20T09:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-07-20T10:00:00Z'),
                rrule: { freq: 'YEARLY', interval: 2 },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            var years = result.map(function (o) { return adapter.getYear(o.start); });
            expect(years).to.deep.equal([2025, 2027, 2029]);
        });
        it('creates all-day multi-day occurrence spanning into visible range even if start precedes first visible day', function () {
            // Visible: Jan 05-09
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-05T00:00:00Z');
            var days = makeDays(visibleStart, 5);
            // All-day multi-day spanning Jan 03-06
            var event = createEvent({
                id: 'all-day-multi-day',
                allDay: true,
                start: luxon_1.DateTime.fromISO('2025-01-03T00:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-06T23:59:59Z'),
                rrule: { freq: 'DAILY', interval: 7 },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            expect(result).to.have.length(1);
            expect(adapter.getDate(result[0].start)).to.equal(3);
            expect(adapter.getDate(result[0].end)).to.equal(6);
        });
        it('does not generate occurrences earlier than DTSTART within the first week even if byDay spans the week', function () {
            // Take the full week (Mon–Sun) and set DTSTART on Wednesday
            var visibleStart = luxon_1.DateTime.fromISO('2025-01-05T00:00:00Z');
            var weekStart = visibleStart.startOf('week'); // Monday
            var days = makeDays(weekStart, 7); // 7 visible days for that week
            // DTSTART on Wednesday of that same week
            var start = weekStart.set({ weekday: 3 }); // Wednesday
            var event = createEvent({
                id: 'standup',
                title: 'Standup',
                start: start,
                end: start.plus({ minutes: 30 }),
                rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            var numToByDay = (0, recurrence_utils_1.getByDayMaps)(adapter).numToByDay;
            var dows = result.map(function (o) { return numToByDay[adapter.getDayOfWeek(o.start)]; });
            // Only WE, TH, FR in the first week
            expect(dows).to.deep.equal(['WE', 'TH', 'FR']);
        });
        it('returns empty array when no dates match recurrence in visible window', function () {
            var visibleStart = luxon_1.DateTime.fromISO('2025-02-01T00:00:00Z');
            var days = makeDays(visibleStart, 28);
            var event = createEvent({
                start: luxon_1.DateTime.fromISO('2025-01-10T09:00:00Z'),
                end: luxon_1.DateTime.fromISO('2025-01-10T10:00:00Z'),
                rrule: {
                    freq: 'MONTHLY',
                    interval: 1,
                    byMonthDay: [10],
                    until: luxon_1.DateTime.fromISO('2025-01-31T23:59:59Z'),
                },
            });
            var result = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event, days, adapter);
            expect(result).to.have.length(0);
        });
    });
});
