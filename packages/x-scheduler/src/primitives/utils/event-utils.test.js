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
var event_utils_1 = require("./event-utils");
var getAdapter_1 = require("./adapter/getAdapter");
describe('event-utils', function () {
    var adapter = (0, getAdapter_1.getAdapter)();
    var createEvent = function (id, start, end) { return ({
        id: id,
        key: id,
        start: adapter.date(start),
        end: adapter.date(end),
        title: "Event ".concat(id),
        allDay: true,
    }); };
    describe('getEventWithLargestRowIndex', function () {
        it('should return the largest row index from events', function () {
            var events = [
                {
                    id: '1',
                    key: '1',
                    start: luxon_1.DateTime.fromISO('2025-05-01T09:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-01T10:00:00'),
                    title: 'Meeting',
                    allDay: true,
                    eventRowIndex: 1,
                },
                {
                    id: '2',
                    key: '2',
                    start: luxon_1.DateTime.fromISO('2025-05-15T14:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-15T15:00:00'),
                    title: 'Doctor Appointment',
                    allDay: true,
                    eventRowIndex: 3,
                },
                {
                    id: '3',
                    key: '3',
                    start: luxon_1.DateTime.fromISO('2025-05-20T16:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-20T17:00:00'),
                    title: 'Conference Call',
                    allDay: true,
                    eventRowIndex: 2,
                },
            ];
            var result = (0, event_utils_1.getEventWithLargestRowIndex)(events);
            expect(result).toBe(3);
        });
        it('should return 0 when events array is empty', function () {
            var events = [];
            var result = (0, event_utils_1.getEventWithLargestRowIndex)(events);
            expect(result).toBe(0);
        });
        it('should return 0 when all events have undefined eventRowIndex', function () {
            var eventsWithUndefinedRowIndex = [
                {
                    id: '1',
                    key: '1',
                    start: luxon_1.DateTime.fromISO('2025-05-01T09:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-01T10:00:00'),
                    title: 'Meeting',
                    allDay: true,
                    eventRowIndex: undefined,
                },
                {
                    id: '2',
                    key: '2',
                    start: luxon_1.DateTime.fromISO('2025-05-15T14:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-15T15:00:00'),
                    title: 'Doctor Appointment',
                    allDay: true,
                    eventRowIndex: undefined,
                },
            ];
            var result = (0, event_utils_1.getEventWithLargestRowIndex)(eventsWithUndefinedRowIndex);
            expect(result).toBe(0);
        });
        it('should handle mix of defined and undefined eventRowIndex values', function () {
            var events = [
                {
                    id: '1',
                    key: '1',
                    start: luxon_1.DateTime.fromISO('2025-05-01T09:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-01T10:00:00'),
                    title: 'Meeting',
                    allDay: true,
                    eventRowIndex: undefined,
                },
                {
                    id: '2',
                    key: '2',
                    start: luxon_1.DateTime.fromISO('2025-05-15T14:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-15T15:00:00'),
                    title: 'Doctor Appointment',
                    allDay: true,
                    eventRowIndex: 2,
                },
                {
                    id: '3',
                    key: '3',
                    start: luxon_1.DateTime.fromISO('2025-05-20T16:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-20T17:00:00'),
                    title: 'Conference Call',
                    allDay: true,
                    eventRowIndex: undefined,
                },
            ];
            var result = (0, event_utils_1.getEventWithLargestRowIndex)(events);
            expect(result).toBe(2);
        });
    });
    describe('isDayWithinRange', function () {
        var eventFirstDay = adapter.date('2024-01-15');
        var eventLastDay = adapter.date('2024-01-17');
        it('should return true when day is same as event first day', function () {
            var day = adapter.date('2024-01-15');
            var result = (0, event_utils_1.isDayWithinRange)(day, eventFirstDay, eventLastDay, adapter);
            expect(result).toBe(true);
        });
        it('should return true when day is same as event last day', function () {
            var day = adapter.date('2024-01-17');
            var result = (0, event_utils_1.isDayWithinRange)(day, eventFirstDay, eventLastDay, adapter);
            expect(result).toBe(true);
        });
        it('should return true when day is between event first and last day', function () {
            var day = adapter.date('2024-01-16');
            var result = (0, event_utils_1.isDayWithinRange)(day, eventFirstDay, eventLastDay, adapter);
            expect(result).toBe(true);
        });
        it('should return false when day is before event first day', function () {
            var day = adapter.date('2024-01-14');
            var result = (0, event_utils_1.isDayWithinRange)(day, eventFirstDay, eventLastDay, adapter);
            expect(result).toBe(false);
        });
        it('should return false when day is after event last day', function () {
            var day = adapter.date('2024-01-18');
            var result = (0, event_utils_1.isDayWithinRange)(day, eventFirstDay, eventLastDay, adapter);
            expect(result).toBe(false);
        });
    });
    describe('getEventRowIndex', function () {
        var createEventWithPosition = function (id, start, end, eventRowIndex) { return (__assign(__assign({}, createEvent(id, start, end)), { eventRowIndex: eventRowIndex })); };
        it('should return 1 for first event on a day with no existing events', function () {
            var event = createEvent('1', '2024-01-15', '2024-01-15');
            var day = adapter.date('2024-01-15');
            var days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
            var daysMap = new Map([
                ['1/15/2024', { allDayEvents: [] }],
                ['1/16/2024', { allDayEvents: [] }],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event, day, days, daysMap, adapter);
            expect(result).toBe(1);
        });
        it('should return next available row index when other events exist', function () {
            var event = createEvent('3', '2024-01-15', '2024-01-15');
            var day = adapter.date('2024-01-15');
            var days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
            var daysMap = new Map([
                [
                    '1/15/2024',
                    {
                        allDayEvents: [
                            createEventWithPosition('1', '2024-01-15', '2024-01-15', 1),
                            createEventWithPosition('2', '2024-01-15', '2024-01-15', 2),
                        ],
                    },
                ],
                ['1/16/2024', { allDayEvents: [] }],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event, day, days, daysMap, adapter);
            expect(result).toBe(3);
        });
        it('should find gap in row indexes and use the lowest available', function () {
            var event = createEvent('4', '2024-01-15', '2024-01-15');
            var day = adapter.date('2024-01-15');
            var days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
            var daysMap = new Map([
                [
                    '1/15/2024',
                    {
                        allDayEvents: [
                            createEventWithPosition('1', '2024-01-15', '2024-01-15', 1),
                            createEventWithPosition('2', '2024-01-15', '2024-01-15', 3),
                            createEventWithPosition('3', '2024-01-15', '2024-01-15', 4),
                        ],
                    },
                ],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event, day, days, daysMap, adapter);
            expect(result).toBe(2);
        });
        it('should return existing row index when event starts before visible range and exists in first day', function () {
            // Event starting before visible range
            var event = createEvent('1', '2024-01-10', '2024-01-16');
            var day = adapter.date('2024-01-16');
            var days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
            var daysMap = new Map([
                [
                    '1/15/2024',
                    {
                        allDayEvents: [createEventWithPosition('1', '2024-01-10', '2024-01-16', 2)],
                    },
                ],
                ['1/16/2024', { allDayEvents: [] }],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event, day, days, daysMap, adapter);
            expect(result).toBe(2); // Should use existing row index from first day
        });
        it('should return 1 when event starts before visible range but not found in first day', function () {
            var event = createEvent('2', '2024-01-10', '2024-01-16'); // Starts before visible range
            var day = adapter.date('2024-01-16');
            var days = [adapter.date('2024-01-15'), adapter.date('2024-01-16')];
            var daysMap = new Map([
                [
                    '1/15/2024',
                    {
                        allDayEvents: [createEventWithPosition('1', '2024-01-15', '2024-01-15', 1)],
                    },
                ],
                ['1/16/2024', { allDayEvents: [] }],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event, day, days, daysMap, adapter);
            expect(result).toBe(1);
        });
        it('should handle event row placement correctly in all columns', function () {
            var event1 = createEventWithPosition('2', '2024-01-10', '2024-01-15', 1);
            var event2 = createEvent('3', '2024-01-15', '2024-01-16');
            var event3 = createEventWithPosition('3', '2024-01-10', '2024-01-14', 2);
            var day = adapter.date('2024-01-15');
            var days = [
                adapter.date('2024-01-14'),
                adapter.date('2024-01-15'),
                adapter.date('2024-01-16'),
            ];
            var daysMap = new Map([
                ['1/14/2024', { allDayEvents: [event1, event3] }],
                [
                    '1/15/2024',
                    {
                        allDayEvents: [event1],
                    },
                ],
                ['1/16/2024', { allDayEvents: [] }],
            ]);
            var result = (0, event_utils_1.getEventRowIndex)(event2, day, days, daysMap, adapter);
            expect(result).toBe(2);
            var dayKey = adapter.format(day, 'keyboardDate');
            daysMap.get(dayKey).allDayEvents.push(__assign(__assign({}, event2), { eventRowIndex: result }));
            var result2 = (0, event_utils_1.getEventRowIndex)(event2, adapter.date('2024-01-16'), days, daysMap, adapter);
            expect(result2).toBe(2);
        });
    });
    describe('getEventDays', function () {
        var days = [
            adapter.date('2024-01-14'),
            adapter.date('2024-01-15'),
            adapter.date('2024-01-16'),
            adapter.date('2024-01-17'),
            adapter.date('2024-01-18'),
        ];
        describe('shouldOnlyRenderEventInOneCell is false', function () {
            it('should return all days when event spans multiple days', function () {
                var event = createEvent('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(3);
                expect(result.map(function (day) { return adapter.format(day, 'keyboardDate'); })).toEqual([
                    '1/15/2024',
                    '1/16/2024',
                    '1/17/2024',
                ]);
            });
            it('should return single day when event is single day', function () {
                var event = createEvent('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(1);
                expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
            });
            it('should return empty array when event is completely outside visible range', function () {
                var event = createEvent('1', '2024-01-10T10:00:00', '2024-01-12T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(0);
            });
            it('should return empty array when event is after visible range', function () {
                var event = createEvent('1', '2024-01-20T10:00:00', '2024-01-22T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(0);
            });
            it('should handle event that partially overlaps with visible range at the beginning', function () {
                var event = createEvent('1', '2024-01-13T10:00:00', '2024-01-16T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(3);
                expect(result.map(function (day) { return adapter.format(day, 'keyboardDate'); })).toEqual([
                    '1/14/2024',
                    '1/15/2024',
                    '1/16/2024',
                ]);
            });
            it('should handle event that partially overlaps with visible range at the end', function () {
                var event = createEvent('1', '2024-01-16T10:00:00', '2024-01-19T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, false);
                expect(result).toHaveLength(3);
                expect(result.map(function (day) { return adapter.format(day, 'keyboardDate'); })).toEqual([
                    '1/16/2024',
                    '1/17/2024',
                    '1/18/2024',
                ]);
            });
        });
        describe('shouldOnlyRenderEventInOneCell is true', function () {
            it('should return single day when event spans multiple days ', function () {
                var event = createEvent('1', '2024-01-15T10:00:00', '2024-01-17T14:00:00');
                var shouldOnlyRenderEventInOneCell = true;
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, shouldOnlyRenderEventInOneCell);
                expect(result).toHaveLength(1);
                expect(adapter.format(result[0], 'keyboardDate')).toBe('1/15/2024');
            });
            it('should return first visible day when event starts before visible range and shouldOnlyRenderEventInOneCell is true', function () {
                var event = createEvent('1', '2024-01-10T10:00:00', '2024-01-17T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, true);
                expect(result).toHaveLength(1);
                expect(adapter.format(result[0], 'keyboardDate')).toBe('1/14/2024');
            });
            it('should return single day when event is single day and shouldOnlyRenderEventInOneCell is true', function () {
                var event = createEvent('1', '2024-01-16T10:00:00', '2024-01-16T14:00:00');
                var result = (0, event_utils_1.getEventDays)(event, days, adapter, true);
                expect(result).toHaveLength(1);
                expect(adapter.format(result[0], 'keyboardDate')).toBe('1/16/2024');
            });
        });
    });
});
