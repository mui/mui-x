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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var luxon_1 = require("luxon");
var sinon_1 = require("sinon");
var useEventCalendar_1 = require("./useEventCalendar");
var getAdapter_1 = require("../utils/adapter/getAdapter");
var DEFAULT_PARAMS = { events: [] };
describe('useDateNavigation', function () {
    var adapter = (0, getAdapter_1.getAdapter)();
    describe('Method: goToPreviousVisibleDate', function () {
        it('should go to previous day when used in the day view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'day', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToPreviousVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addDays(visibleDate, -1));
        });
        it('should go to start of previous week when used in the week view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'week', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToPreviousVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addWeeks(adapter.startOfWeek(visibleDate), -1));
        });
        it('should go to start of previous month when used in the month view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-15T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'month', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToPreviousVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addMonths(adapter.startOfMonth(visibleDate), -1));
        });
        it('should go to previous agenda period (12 days) when used in the agenda view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'agenda', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToPreviousVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addDays(visibleDate, -12));
        });
    });
    describe('Method: goToNextVisibleDate', function () {
        it('should go to next day when used in the day view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'day', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToNextVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addDays(visibleDate, 1));
        });
        it('should go to start of next week when used in the week view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'week', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToNextVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addWeeks(adapter.startOfWeek(visibleDate), 1));
        });
        it('should go to start of next month when used in the month view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-15T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'month', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToNextVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addMonths(adapter.startOfMonth(visibleDate), 1));
        });
        it('should go to next agenda period (12 days) when used in the agenda view', function () {
            var onVisibleDateChange = (0, sinon_1.spy)();
            var visibleDate = luxon_1.DateTime.fromISO('2025-07-01T00:00:00Z');
            var result = (0, internal_test_utils_1.renderHook)(function () {
                return (0, useEventCalendar_1.useEventCalendar)(__assign(__assign({}, DEFAULT_PARAMS), { view: 'agenda', visibleDate: visibleDate, onVisibleDateChange: onVisibleDateChange }));
            }).result;
            (0, internal_test_utils_1.act)(function () { return result.current.instance.goToNextVisibleDate({}); });
            expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(adapter.addDays(visibleDate, 12));
        });
    });
});
