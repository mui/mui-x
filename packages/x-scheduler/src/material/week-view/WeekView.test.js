"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var luxon_1 = require("luxon");
var scheduler_1 = require("test/utils/scheduler");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var week_view_1 = require("@mui/x-scheduler/material/week-view");
var standalone_view_1 = require("@mui/x-scheduler/material/standalone-view");
var allDayEvents = [
    {
        id: 'all-day-1',
        start: luxon_1.DateTime.fromISO('2025-05-05T00:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-07T23:59:59'),
        title: 'Multi-day Conference',
        allDay: true,
    },
    {
        id: 'all-day-2',
        start: luxon_1.DateTime.fromISO('2025-04-28T00:00:00'), // Previous week
        end: luxon_1.DateTime.fromISO('2025-05-06T23:59:59'), // Current week
        title: 'Long Event',
        allDay: true,
    },
    {
        id: 'all-day-3',
        start: luxon_1.DateTime.fromISO('2025-05-04T00:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-07T23:59:59'),
        title: 'Four day event',
        allDay: true,
    },
];
describe('<WeekView />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)({ clockConfig: new Date('2025-05-04') }).render;
    describe('All day events', function () {
        it('should render all-day events correctly with main event in start date cell', function () {
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <week_view_1.WeekView />
        </standalone_view_1.StandaloneView>);
            var allDayCells = internal_test_utils_1.screen.getAllByRole('gridcell');
            var may5Cell = allDayCells.find(function (cell) {
                var labelledBy = cell.getAttribute('aria-labelledby');
                return labelledBy === null || labelledBy === void 0 ? void 0 : labelledBy.includes('DayTimeGridHeaderCell-5 DayTimeGridAllDayEventsHeaderCell');
            });
            // Main event should render in the start date cell
            expect((0, internal_test_utils_1.within)(may5Cell).getByText('Multi-day Conference')).not.to.equal(null);
            // Invisible events should exist in the spanned cells
            var allEvents = internal_test_utils_1.screen.getAllByLabelText('Multi-day Conference');
            expect(allEvents.length).to.be.greaterThan(1);
            // Check that invisible events have aria-hidden attribute
            var hiddenEvents = allEvents.filter(function (event) { return event.getAttribute('aria-hidden') === 'true'; });
            expect(hiddenEvents.length).to.be.greaterThan(0);
        });
        it('should render all-day event in first cell of week when event starts before the week', function () {
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <week_view_1.WeekView />
        </standalone_view_1.StandaloneView>);
            var allDayHeader = internal_test_utils_1.screen.getByRole('columnheader', { name: /all day/i });
            var allDayGrid = allDayHeader.closest('[class*="AllDayEventsGrid"]');
            var allDayRow = (0, internal_test_utils_1.within)(allDayGrid).getByRole('row');
            var gridCells = (0, internal_test_utils_1.within)(allDayRow).getAllByRole('gridcell');
            // Find the first cell of the first week in May 2025
            var firstCell = gridCells[0];
            // Event should render in the first cell of the week since it started before
            expect((0, internal_test_utils_1.within)(firstCell).getByText('Long Event')).not.to.equal(null);
        });
        it('should place invisible events on the same grid row as the main event', function () {
            var _a;
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <week_view_1.WeekView />
        </standalone_view_1.StandaloneView>);
            var allEvents = internal_test_utils_1.screen.getAllByLabelText('Multi-day Conference');
            var mainEvent = allEvents.find(function (event) { return event.getAttribute('aria-hidden') !== 'true'; });
            var invisibleEvents = allEvents.filter(function (event) { return event.getAttribute('aria-hidden') === 'true'; });
            // Extract grid row from style attribute
            var mainEventStyle = (mainEvent === null || mainEvent === void 0 ? void 0 : mainEvent.getAttribute('style')) || '';
            var mainGridRow = (_a = mainEventStyle.match(/--grid-row:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
            invisibleEvents.forEach(function (invisibleEvent) {
                var _a;
                var invisibleStyle = invisibleEvent.getAttribute('style') || '';
                var invisibleGridRow = (_a = invisibleStyle.match(/--grid-row:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
                expect(invisibleGridRow).to.equal(mainGridRow);
            });
        });
        it('should handle multiple overlapping all-day events with different grid rows', function () {
            var _a, _b, _c;
            var overlappingEvents = [
                {
                    id: 'event-1',
                    start: luxon_1.DateTime.fromISO('2025-05-04T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-06T23:59:59'),
                    title: 'Event 1',
                    allDay: true,
                },
                {
                    id: 'event-2',
                    start: luxon_1.DateTime.fromISO('2025-05-05T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-07T23:59:59'),
                    title: 'Event 2',
                    allDay: true,
                },
                {
                    id: 'event-3',
                    start: luxon_1.DateTime.fromISO('2025-05-08T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-09T23:59:59'),
                    title: 'Event 3',
                    allDay: true,
                },
            ];
            render(<standalone_view_1.StandaloneView events={overlappingEvents} resources={[]}>
          <week_view_1.WeekView />
        </standalone_view_1.StandaloneView>);
            var event1Elements = internal_test_utils_1.screen.getAllByLabelText('Event 1');
            var event2Elements = internal_test_utils_1.screen.getAllByLabelText('Event 2');
            var event3Elements = internal_test_utils_1.screen.getAllByLabelText('Event 3');
            var event1Main = event1Elements.find(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            var event2Main = event2Elements.find(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            var event3Main = event3Elements.find(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            // Extract grid rows
            var event1Style = (event1Main === null || event1Main === void 0 ? void 0 : event1Main.getAttribute('style')) || '';
            var event2Style = (event2Main === null || event2Main === void 0 ? void 0 : event2Main.getAttribute('style')) || '';
            var event3Style = (event3Main === null || event3Main === void 0 ? void 0 : event3Main.getAttribute('style')) || '';
            var event1GridRow = (_a = event1Style.match(/--grid-row:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
            var event2GridRow = (_b = event2Style.match(/--grid-row:\s*(\d+)/)) === null || _b === void 0 ? void 0 : _b[1];
            var event3GridRow = (_c = event3Style.match(/--grid-row:\s*(\d+)/)) === null || _c === void 0 ? void 0 : _c[1];
            expect(event1GridRow).to.equal('1');
            expect(event2GridRow).to.equal('2');
            expect(event3GridRow).to.equal('1');
        });
        it('should render all-day events with correct grid column span', function () {
            var _a;
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <week_view_1.WeekView />
        </standalone_view_1.StandaloneView>);
            var allDayHeader = internal_test_utils_1.screen.getByRole('columnheader', { name: /all day/i });
            var allDayGrid = allDayHeader.closest('[class*="AllDayEventsGrid"]');
            var allDayRow = (0, internal_test_utils_1.within)(allDayGrid).getByRole('row');
            var mainEvent = (0, internal_test_utils_1.within)(allDayRow)
                .getAllByLabelText('Four day event')
                .find(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            var eventStyle = (mainEvent === null || mainEvent === void 0 ? void 0 : mainEvent.getAttribute('style')) || '';
            var gridColumnSpan = (_a = eventStyle.match(/--grid-column-span:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
            // Should span 4 columns (4 days)
            expect(gridColumnSpan).to.equal('4');
        });
    });
});
