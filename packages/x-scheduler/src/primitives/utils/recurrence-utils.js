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
exports.getByDayMaps = getByDayMaps;
exports.weeklyByDayCodes = weeklyByDayCodes;
exports.detectRecurrenceKeyFromRule = detectRecurrenceKeyFromRule;
exports.buildRecurrencePresets = buildRecurrencePresets;
exports.getAllDaySpanDays = getAllDaySpanDays;
exports.getRecurringEventOccurrencesForVisibleDays = getRecurringEventOccurrencesForVisibleDays;
exports.buildEndGuard = buildEndGuard;
exports.matchesRecurrence = matchesRecurrence;
exports.estimateOccurrencesUpTo = estimateOccurrencesUpTo;
exports.countWeeklyOccurrencesUpToExact = countWeeklyOccurrencesUpToExact;
exports.countMonthlyOccurrencesUpToExact = countMonthlyOccurrencesUpToExact;
exports.countYearlyOccurrencesUpToExact = countYearlyOccurrencesUpToExact;
var date_utils_1 = require("./date-utils");
/**
 * Build BYDAY<->number maps using a known ISO Monday (2025-01-06).
 * Day numbers come from adapter.getDayOfWeek(), so it respects the adapter’s locale/numbering.
 */
function getByDayMaps(adapter) {
    var baseMonday = adapter.date('2025-01-06T00:00:00Z'); // ISO Monday
    var byDayCodes = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    var byDayToNum = {};
    for (var i = 0; i < byDayCodes.length; i += 1) {
        var day = i === 0 ? baseMonday : adapter.addDays(baseMonday, i);
        byDayToNum[byDayCodes[i]] = adapter.getDayOfWeek(day);
    }
    var numToByDay = {};
    for (var _i = 0, byDayCodes_1 = byDayCodes; _i < byDayCodes_1.length; _i++) {
        var byDayCode = byDayCodes_1[_i];
        numToByDay[byDayToNum[byDayCode]] = byDayCode;
    }
    return { byDayToNum: byDayToNum, numToByDay: numToByDay };
}
// Validate WEEKLY BYDAY and return ByDayCode[] (or fallback)
function weeklyByDayCodes(ruleByDay, fallback) {
    if (!(ruleByDay === null || ruleByDay === void 0 ? void 0 : ruleByDay.length)) {
        return fallback;
    }
    if (!ruleByDay.every(function (v) { return /^(MO|TU|WE|TH|FR|SA|SU)$/.test(v); })) {
        throw new Error('WEEKLY expects plain BYDAY codes (MO..SU), ordinals like 1MO or -1FR are not valid.');
    }
    return ruleByDay;
}
function detectRecurrenceKeyFromRule(adapter, rule, start) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (!rule) {
        return null;
    }
    var interval = (_a = rule.interval) !== null && _a !== void 0 ? _a : 1;
    var neverEnds = !rule.count && !rule.until;
    var hasSelectors = !!(((_b = rule.byDay) === null || _b === void 0 ? void 0 : _b.length) || ((_c = rule.byMonthDay) === null || _c === void 0 ? void 0 : _c.length) || ((_d = rule.byMonth) === null || _d === void 0 ? void 0 : _d.length));
    var numToCode = getByDayMaps(adapter).numToByDay;
    switch (rule.freq) {
        case 'DAILY': {
            // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
            return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
        }
        case 'WEEKLY': {
            // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
            var startDowCode = numToCode[adapter.getDayOfWeek(start)];
            var byDay = (_e = rule.byDay) !== null && _e !== void 0 ? _e : [];
            var matchesDefaultByDay = byDay.length === 0 || (byDay.length === 1 && byDay[0] === startDowCode);
            var isPresetWeekly = interval === 1 &&
                neverEnds &&
                matchesDefaultByDay &&
                !(((_f = rule.byMonthDay) === null || _f === void 0 ? void 0 : _f.length) || ((_g = rule.byMonth) === null || _g === void 0 ? void 0 : _g.length));
            return isPresetWeekly ? 'weekly' : 'custom';
        }
        case 'MONTHLY': {
            // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
            var day = adapter.getDate(start);
            var byMonthDay = (_h = rule.byMonthDay) !== null && _h !== void 0 ? _h : [];
            var matchesDefaultByMonthDay = byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
            var isPresetMonthly = interval === 1 &&
                neverEnds &&
                matchesDefaultByMonthDay &&
                !(((_j = rule.byDay) === null || _j === void 0 ? void 0 : _j.length) || ((_k = rule.byMonth) === null || _k === void 0 ? void 0 : _k.length));
            return isPresetMonthly ? 'monthly' : 'custom';
        }
        case 'YEARLY': {
            // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
            return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
        }
        default:
            return 'custom';
    }
}
function buildRecurrencePresets(adapter, start) {
    var numToCode = getByDayMaps(adapter).numToByDay;
    var startDowCode = numToCode[adapter.getDayOfWeek(start)];
    var startDayOfMonth = adapter.getDate(start);
    return {
        daily: {
            freq: 'DAILY',
            interval: 1,
        },
        weekly: {
            freq: 'WEEKLY',
            interval: 1,
            byDay: [startDowCode],
        },
        monthly: {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [startDayOfMonth],
        },
        yearly: {
            freq: 'YEARLY',
            interval: 1,
        },
    };
}
/**
 *  Inclusive span (in days) for all-day events.
 *  @returns At least 1, start==end yields 1.
 */
function getAllDaySpanDays(adapter, event) {
    // TODO: Now only all-day events are implemented, we should add support for timed events that span multiple days later
    if (!event.allDay) {
        return 1;
    }
    // +1 so start/end same day = 1 day, spans include last day
    return Math.max(1, (0, date_utils_1.diffIn)(adapter, adapter.startOfDay(event.end), adapter.startOfDay(event.start), 'days') + 1);
}
/**
 *  Expands a recurring `event` into concrete occurrences within the visible days.
 *  Honors COUNT/UNTIL via `buildEndGuard` and date pattern via `matchesRecurrence`.
 *  Preserves timed duration; for all-day spans, expands to cover the full multi-day block.
 *  @returns Sorted list (by start) of concrete occurrences.
 */
function getRecurringEventOccurrencesForVisibleDays(event, days, adapter) {
    var rule = event.rrule;
    var instances = [];
    var endGuard = buildEndGuard(rule, event.start, adapter);
    var durationMinutes = (0, date_utils_1.diffIn)(adapter, event.end, event.start, 'minutes');
    var rangeStart = days[0];
    var rangeEnd = days[days.length - 1];
    var allDaySpanDays = getAllDaySpanDays(adapter, event);
    var scanStart = adapter.addDays(rangeStart, -(allDaySpanDays - 1));
    for (var day = adapter.startOfDay(scanStart); !adapter.isAfter(day, rangeEnd); day = adapter.addDays(day, 1)) {
        // The series is still active on that day
        if (!endGuard(day)) {
            continue;
        }
        // the pattern matches on that day
        if (!matchesRecurrence(rule, day, adapter, event)) {
            continue;
        }
        var occurrenceStart = event.allDay
            ? adapter.startOfDay(day)
            : (0, date_utils_1.mergeDateAndTime)(adapter, day, event.start);
        var occurrenceEnd = event.allDay
            ? adapter.endOfDay(adapter.addDays(occurrenceStart, allDaySpanDays - 1))
            : adapter.addMinutes(occurrenceStart, durationMinutes);
        var key = "".concat(event.id, "::").concat(adapter.format(occurrenceStart, 'keyboardDate'));
        instances.push(__assign(__assign({}, event), { key: key, start: occurrenceStart, end: occurrenceEnd }));
    }
    return instances;
}
/**
 *  Builds a predicate that says whether the series is still active on a given date.
 *  Supports either COUNT or UNTIL (mutually exclusive, UNTIL is inclusive of that day).
 *  COUNT uses `estimateOccurrencesUpTo` (inclusive) to stop after the Nth occurrence.
 */
function buildEndGuard(rule, seriesStart, adapter) {
    var hasCount = typeof rule.count === 'number' && rule.count > 0;
    var hasUntil = !!rule.until;
    if (hasCount && hasUntil) {
        throw new Error('RRULE invalid: COUNT and UNTIL are mutually exclusive per RFC 5545.');
    }
    if (!hasCount && !hasUntil) {
        return function () { return true; }; // never ends
    }
    return function (date) {
        var dayStart = adapter.startOfDay(date);
        if (hasUntil) {
            var untilEndOfDay = adapter.endOfDay(rule.until);
            if (adapter.isAfter(dayStart, untilEndOfDay)) {
                return false;
            }
        }
        if (hasCount) {
            var occurrencesSoFar = estimateOccurrencesUpTo(adapter, rule, seriesStart, dayStart);
            if (occurrencesSoFar > rule.count) {
                return false;
            }
        }
        return true;
    };
}
/**
 *  Tests whether `date` matches the RRULE (never matches before DTSTART).
 *  DAILY: day-diff % interval === 0.
 *  WEEKLY: week-diff % interval === 0 and weekday in BYDAY (defaults to DTSTART weekday).
 *  MONTHLY: supports only BYMONTHDAY (or defaults to DTSTART day); BYDAY is not yet supported.
 *  YEARLY: same month/day as DTSTART; BYxxx selectors are not allowed here.
 *  @throws For unsupported YEARLY or MONTHLY selector combos.
 */
function matchesRecurrence(rule, date, adapter, event) {
    var _a, _b, _c, _d, _e, _f;
    var interval = Math.max(1, (_a = rule.interval) !== null && _a !== void 0 ? _a : 1);
    var seriesStartDay = adapter.startOfDay(event.start);
    var candidateDay = adapter.startOfDay(date);
    if (adapter.isBefore(candidateDay, seriesStartDay)) {
        return false;
    }
    switch (rule.freq) {
        case 'DAILY': {
            var daysDiff = (0, date_utils_1.diffIn)(adapter, candidateDay, seriesStartDay, 'days');
            return daysDiff % interval === 0;
        }
        case 'WEEKLY': {
            var seriesWeek = adapter.startOfWeek(seriesStartDay);
            var dateWeek = adapter.startOfWeek(candidateDay);
            var numToCode = getByDayMaps(adapter).numToByDay;
            // If no BYDAY is provided in a WEEKLY rule, default to the weekday of DTSTART.
            var byDay = weeklyByDayCodes(rule.byDay, [numToCode[adapter.getDayOfWeek(seriesStartDay)]]);
            var dateDowCode = numToCode[adapter.getDayOfWeek(candidateDay)];
            if (!byDay.includes(dateDowCode)) {
                return false;
            }
            var weeksDiff = (0, date_utils_1.diffIn)(adapter, dateWeek, seriesWeek, 'weeks');
            return weeksDiff % interval === 0;
        }
        case 'MONTHLY': {
            var seriesMonth = adapter.startOfMonth(seriesStartDay);
            var dateMonth = adapter.startOfMonth(candidateDay);
            var monthsDiff = (0, date_utils_1.diffIn)(adapter, dateMonth, seriesMonth, 'months');
            if (monthsDiff % interval !== 0) {
                return false;
            }
            // TODO (#19128): Add support for monthly recurrence modes (BYDAY rules)
            if ((_b = rule.byDay) === null || _b === void 0 ? void 0 : _b.length) {
                // Only "same day-of-month" mode is supported right now.
                throw new Error('MONTHLY supports only exact same date recurrence (day of month of DTSTART).');
            }
            // If no BYMONTHDAY is provided in a MONTHLY rule, default to the day of month of DTSTART.
            var byMonthDay = ((_c = rule.byMonthDay) === null || _c === void 0 ? void 0 : _c.length)
                ? rule.byMonthDay
                : [adapter.getDate(seriesStartDay)];
            return byMonthDay.includes(adapter.getDate(candidateDay));
        }
        case 'YEARLY': {
            var seriesYear = adapter.startOfYear(seriesStartDay);
            var dateYear = adapter.startOfYear(candidateDay);
            // Only exact "same month + same day" recurrence is supported.
            // Any use of BYMONTH, BYMONTHDAY, BYDAY, or multiple values is not allowed.
            if (((_d = rule.byMonth) === null || _d === void 0 ? void 0 : _d.length) || ((_e = rule.byMonthDay) === null || _e === void 0 ? void 0 : _e.length) || ((_f = rule.byDay) === null || _f === void 0 ? void 0 : _f.length)) {
                throw new Error('YEARLY supports only exact same date recurrence (month/day of DTSTART).');
            }
            var sameMonth = adapter.getMonth(candidateDay) === adapter.getMonth(seriesStartDay);
            var sameDay = adapter.getDate(candidateDay) === adapter.getDate(seriesStartDay);
            if (!sameMonth || !sameDay) {
                return false;
            }
            var yearsDiff = (0, date_utils_1.diffIn)(adapter, dateYear, seriesYear, 'years');
            return yearsDiff % interval === 0;
        }
        default:
            return false;
    }
}
/**
 *  Estimates how many occurrences exist from DTSTART up to `date` (inclusive).
 *  Used to enforce COUNT. Delegates to exact counters for WEEKLY/MONTHLY/YEARLY.
 *  Returns 0 if `date` is before DTSTART (day precision).
 */
function estimateOccurrencesUpTo(adapter, rule, seriesStart, date) {
    var _a;
    if (adapter.isBeforeDay(date, seriesStart)) {
        return 0;
    }
    var interval = Math.max(1, (_a = rule.interval) !== null && _a !== void 0 ? _a : 1);
    switch (rule.freq) {
        case 'DAILY': {
            var totalDays = (0, date_utils_1.diffIn)(adapter, adapter.startOfDay(date), adapter.startOfDay(seriesStart), 'days');
            return Math.floor(totalDays / interval) + 1;
        }
        case 'WEEKLY':
            return countWeeklyOccurrencesUpToExact(adapter, rule, seriesStart, date);
        case 'MONTHLY':
            return countMonthlyOccurrencesUpToExact(adapter, rule, seriesStart, date);
        case 'YEARLY':
            return countYearlyOccurrencesUpToExact(adapter, rule, seriesStart, date);
        default:
            throw new Error([
                "Unknown frequency: ".concat(rule.freq),
                'Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".',
            ].join('\n'));
    }
}
/**
 *  Given a week start and a BYDAY code, returns the exact date in that week.
 */
function dayInWeek(adapter, weekStart, code) {
    var codeToNum = getByDayMaps(adapter).byDayToNum;
    var weekStartDow = adapter.getDayOfWeek(weekStart);
    var ruleDow = codeToNum[code];
    var delta = (((ruleDow - weekStartDow) % 7) + 7) % 7;
    return adapter.startOfDay(adapter.addDays(weekStart, delta));
}
/**
 *  Exact WEEKLY occurrence count up to `date` (inclusive).
 *  Iterates weeks by `interval`, checking each BYDAY. Skips days before DTSTART.
 *  BYDAY defaults to DTSTART weekday if omitted.
 */
function countWeeklyOccurrencesUpToExact(adapter, rule, seriesStart, date) {
    var _a;
    if (adapter.isBeforeDay(date, seriesStart)) {
        return 0;
    }
    var numToCode = getByDayMaps(adapter).numToByDay;
    var byDay = weeklyByDayCodes(rule.byDay, [numToCode[adapter.getDayOfWeek(seriesStart)]]);
    var interval = Math.max(1, (_a = rule.interval) !== null && _a !== void 0 ? _a : 1);
    var seriesWeekStart = adapter.startOfWeek(seriesStart);
    var targetWeekStart = adapter.startOfWeek(date);
    var count = 0;
    // Iterate weeks from start to target, stepping by `interval`
    for (var week = seriesWeekStart; !adapter.isAfter(week, targetWeekStart); week = adapter.addWeeks(week, interval)) {
        // For the current week, check each weekday specified in BYDAY
        for (var _i = 0, byDay_1 = byDay; _i < byDay_1.length; _i++) {
            var code = byDay_1[_i];
            var occurrenceDay = dayInWeek(adapter, week, code);
            if (adapter.isBeforeDay(occurrenceDay, seriesStart)) {
                continue;
            }
            if (adapter.isAfterDay(occurrenceDay, date)) {
                continue;
            }
            count += 1;
        }
    }
    return count;
}
/**
 *  Exact MONTHLY occurrence count up to `date` (inclusive).
 *  Supports a single BYMONTHDAY (defaults to DTSTART day). Skips months lacking that day.
 *  Iterates months by `interval`, respecting series start and target boundaries.
 *  @throws If multiple BYMONTHDAY values are provided.
 */
function countMonthlyOccurrencesUpToExact(adapter, rule, seriesStart, date) {
    var _a, _b, _c, _d, _e;
    var seriesStartMonth = adapter.startOfMonth(seriesStart);
    var targetMonth = adapter.startOfMonth(date);
    if (adapter.isBefore(targetMonth, seriesStartMonth)) {
        return 0;
    }
    var interval = Math.max(1, (_a = rule.interval) !== null && _a !== void 0 ? _a : 1);
    // TODO (#19128): Add support for monthly recurrence modes (BYDAY rules)
    if ((_b = rule.byDay) === null || _b === void 0 ? void 0 : _b.length) {
        // Only "same day-of-month" mode is supported right now.
        // If a MONTHLY rule provides BYDAY (e.g., 2TU, -1FR), we intentionally IGNORE it for now.
    }
    // Guard: only a single BYMONTHDAY is supported for MONTHLY
    if (((_d = (_c = rule.byMonthDay) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 1) {
        throw new Error('MONTHLY supports only a single BYMONTHDAY.');
    }
    // If no BYMONTHDAY is provided in a MONTHLY rule, default to the day of month of DTSTART.
    var dayOfMonth = ((_e = rule.byMonthDay) === null || _e === void 0 ? void 0 : _e.length) ? rule.byMonthDay[0] : adapter.getDate(seriesStart);
    var count = 0;
    // Iterate months from start to target, stepping by `interval`
    for (var month = seriesStartMonth; !adapter.isAfter(month, targetMonth); month = adapter.addMonths(month, interval)) {
        // if the day doesn't exist in this month, skip it
        var daysInMonth = adapter.getDaysInMonth(month);
        if (dayOfMonth > daysInMonth) {
            continue;
        }
        var candidate = adapter.startOfDay(adapter.setDate(month, dayOfMonth));
        if (adapter.isBeforeDay(candidate, seriesStart)) {
            continue;
        }
        if (adapter.isAfterDay(candidate, date)) {
            continue;
        }
        count += 1;
    }
    return count;
}
/**
 *  Exact YEARLY occurrence count up to `date` (inclusive).
 *  Only same month/day as DTSTART, skips non-leap years for Feb 29.
 *  Iterates years by `interval`, bounded by series start and target year.
 *  @throws If BYMONTH/DAY/BYDAY are present (unsupported for YEARLY at the moment).
 */
function countYearlyOccurrencesUpToExact(adapter, rule, seriesStart, date) {
    var _a, _b, _c, _d;
    var seriesStartYear = adapter.startOfYear(seriesStart);
    var targetYearStart = adapter.startOfYear(date);
    if (adapter.isBefore(targetYearStart, seriesStartYear)) {
        return 0;
    }
    var interval = Math.max(1, (_a = rule.interval) !== null && _a !== void 0 ? _a : 1);
    // Only the exact same calendar date is supported for YEARLY (month and day of DTSTART).
    // Any use of BYMONTH, BYMONTHDAY, or BYDAY is not allowed at the moment.
    if (((_b = rule.byMonth) === null || _b === void 0 ? void 0 : _b.length) || ((_c = rule.byMonthDay) === null || _c === void 0 ? void 0 : _c.length) || ((_d = rule.byDay) === null || _d === void 0 ? void 0 : _d.length)) {
        throw new Error('YEARLY supports only exact same date recurrence (month/day of DTSTART).');
    }
    var targetMonth = adapter.getMonth(seriesStart);
    var targetDayOfMonth = adapter.getDate(seriesStart);
    var count = 0;
    // Iterate years from the series start (inclusive) to the target year (inclusive),
    // stepping by `interval`.
    for (var year = seriesStartYear; !adapter.isAfter(year, targetYearStart); year = adapter.addYears(year, interval)) {
        // Anchor to the target month in the current year
        var monthAnchor = adapter.setMonth(year, targetMonth);
        // Skip years where the requested day doesn't exist (e.g., Feb 29 on non-leap years)
        var daysInMonth = adapter.getDaysInMonth(monthAnchor);
        if (targetDayOfMonth > daysInMonth) {
            continue;
        }
        var candidate = adapter.startOfDay(adapter.setDate(monthAnchor, targetDayOfMonth));
        if (adapter.isBeforeDay(candidate, seriesStart)) {
            continue;
        }
        if (adapter.isAfterDay(candidate, date)) {
            continue;
        }
        count += 1;
    }
    return count;
}
