"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var luxon_1 = require("luxon");
var scheduler_1 = require("test/utils/scheduler");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var month_view_1 = require("@mui/x-scheduler/material/month-view");
var standalone_view_1 = require("@mui/x-scheduler/material/standalone-view");
var events = [
    {
        id: '1',
        start: luxon_1.DateTime.fromISO('2025-05-01T09:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-01T10:00:00'),
        title: 'Meeting',
    },
    {
        id: '2',
        start: luxon_1.DateTime.fromISO('2025-05-15T14:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-15T15:00:00'),
        title: 'Doctor Appointment',
    },
];
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
        start: luxon_1.DateTime.fromISO('2025-05-12T00:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-14T23:59:59'),
        title: 'Grid Row Test',
        allDay: true,
    },
    {
        id: 'all-day-4',
        start: luxon_1.DateTime.fromISO('2025-05-14T00:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-16T23:59:59'),
        title: 'Three Day Event',
        allDay: true,
    },
    {
        id: 'all-day-5',
        start: luxon_1.DateTime.fromISO('2025-05-06T00:00:00'),
        end: luxon_1.DateTime.fromISO('2025-05-16T23:59:59'),
        title: 'Multiple week event',
        allDay: true,
    },
];
describe('<MonthView />', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)({ clockConfig: new Date('2025-05-01') }).render;
    var standaloneDefaults = {
        events: events,
        resources: [],
    };
    it('should render the weekday headers, a cell for each day, and show the abbreviated month for day 1', function () {
        render(<standalone_view_1.StandaloneView {...standaloneDefaults}>
        <month_view_1.MonthView />
      </standalone_view_1.StandaloneView>);
        var headerTexts = internal_test_utils_1.screen.getAllByRole('columnheader').map(function (header) { return header.textContent; });
        var gridCells = internal_test_utils_1.screen.getAllByRole('gridcell');
        expect(headerTexts).to.include.members(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        expect(gridCells.length).to.be.at.least(31);
        expect(internal_test_utils_1.screen.getByText(/may 1/i)).not.to.equal(null);
    });
    it('should render events in the correct cell', function () {
        render(<standalone_view_1.StandaloneView {...standaloneDefaults}>
        <month_view_1.MonthView />
      </standalone_view_1.StandaloneView>);
        var gridCells = internal_test_utils_1.screen.getAllByRole('gridcell');
        var may1Cell = gridCells.find(function (cell) { return (0, internal_test_utils_1.within)(cell).queryByText(/may 1/i); });
        var may15Cell = gridCells.find(function (cell) { return (0, internal_test_utils_1.within)(cell).queryByText(/15/); });
        expect((0, internal_test_utils_1.within)(may1Cell).getByText('Meeting')).not.to.equal(null);
        expect((0, internal_test_utils_1.within)(may15Cell).getByText('Doctor Appointment')).not.to.equal(null);
    });
    it('should move to the day view when a day is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handleViewChange, handleVisibleDateChange, user, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleViewChange = (0, sinon_1.spy)();
                    handleVisibleDateChange = (0, sinon_1.spy)();
                    user = render(<standalone_view_1.StandaloneView {...standaloneDefaults} onViewChange={handleViewChange} onVisibleDateChange={handleVisibleDateChange}>
        <month_view_1.MonthView />
      </standalone_view_1.StandaloneView>).user;
                    button = internal_test_utils_1.screen.getByRole('button', { name: '15' });
                    return [4 /*yield*/, user.click(button)];
                case 1:
                    _a.sent();
                    expect(handleViewChange.calledOnce).to.equal(true);
                    expect(handleViewChange.firstCall.firstArg).to.equal('day');
                    expect(handleVisibleDateChange.calledOnce).to.equal(true);
                    expect(handleVisibleDateChange.firstCall.firstArg).toEqualDateTime(luxon_1.DateTime.fromISO('2025-05-15T00:00:00'));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render day numbers as plain text when the day view is not enabled', function () {
        render(<standalone_view_1.StandaloneView {...standaloneDefaults} views={['week', 'month']}>
        <month_view_1.MonthView />
      </standalone_view_1.StandaloneView>);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: '15' })).to.equal(null);
        expect(internal_test_utils_1.screen.getByText('15')).not.to.equal(null);
    });
    it('should show "+N more..." when there are more events than fit in a cell', function () {
        var manyEvents = [
            {
                id: '1',
                start: luxon_1.DateTime.fromISO('2025-05-01T08:00:00'),
                end: luxon_1.DateTime.fromISO('2025-05-01T09:00:00'),
                title: 'Breakfast',
            },
            {
                id: '2',
                start: luxon_1.DateTime.fromISO('2025-05-01T09:30:00'),
                end: luxon_1.DateTime.fromISO('2025-05-01T10:30:00'),
                title: 'Team Standup',
            },
            {
                id: '3',
                start: luxon_1.DateTime.fromISO('2025-05-01T11:00:00'),
                end: luxon_1.DateTime.fromISO('2025-05-01T12:00:00'),
                title: 'Client Call',
            },
            {
                id: '4',
                start: luxon_1.DateTime.fromISO('2025-05-01T13:00:00'),
                end: luxon_1.DateTime.fromISO('2025-05-01T14:00:00'),
                title: 'Lunch',
            },
            {
                id: '5',
                start: luxon_1.DateTime.fromISO('2025-05-01T15:00:00'),
                end: luxon_1.DateTime.fromISO('2025-05-01T16:00:00'),
                title: 'Design Review',
            },
        ];
        render(<standalone_view_1.StandaloneView events={manyEvents} resources={[]}>
        <month_view_1.MonthView />
      </standalone_view_1.StandaloneView>);
        expect(internal_test_utils_1.screen.getByText(/more/i)).not.to.equal(null);
    });
    describe('All day events', function () {
        it('should render all-day events correctly with main event in start date cell', function () {
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <month_view_1.MonthView />
        </standalone_view_1.StandaloneView>);
            var gridCells = internal_test_utils_1.screen.getAllByRole('gridcell');
            var may5Cell = gridCells.find(function (cell) { return (0, internal_test_utils_1.within)(cell).queryByText(/5/); });
            // Main event should render in the start date cell
            expect((0, internal_test_utils_1.within)(may5Cell).getByText('Multi-day Conference')).not.to.equal(null);
            // Invisible events should exist in the spanned cells
            var eventInstances = internal_test_utils_1.screen.getAllByLabelText('Multi-day Conference');
            expect(eventInstances.length).to.be.greaterThan(1);
            // Check that invisible events have aria-hidden attribute
            var hiddenEvents = eventInstances.filter(function (event) { return event.getAttribute('aria-hidden') === 'true'; });
            expect(hiddenEvents.length).to.be.greaterThan(0);
            var visibleEvents = eventInstances.filter(function (event) { return event.getAttribute('aria-hidden') !== 'true'; });
            expect(visibleEvents).to.have.length(1);
        });
        it('should render all-day event in first cell of week when event starts before the week', function () {
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <month_view_1.MonthView />
        </standalone_view_1.StandaloneView>);
            var gridCells = internal_test_utils_1.screen.getAllByRole('gridcell');
            // Find the first cell of the first week in May 2025
            var firstCell = gridCells.find(function (cell) { return (0, internal_test_utils_1.within)(cell).queryByText(/4/); });
            // Event should render in the first cell of the week since it started before
            expect((0, internal_test_utils_1.within)(firstCell).getByText('Long Event')).not.to.equal(null);
        });
        it('should place invisible events on the same grid row as the main event', function () {
            var _a;
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <month_view_1.MonthView />
        </standalone_view_1.StandaloneView>);
            var allEvents = internal_test_utils_1.screen.getAllByLabelText('Grid Row Test');
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
                    start: luxon_1.DateTime.fromISO('2025-05-12T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-14T23:59:59'),
                    title: 'Event 1',
                    allDay: true,
                },
                {
                    id: 'event-2',
                    start: luxon_1.DateTime.fromISO('2025-05-13T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-15T23:59:59'),
                    title: 'Event 2',
                    allDay: true,
                },
                {
                    id: 'event-3',
                    start: luxon_1.DateTime.fromISO('2025-05-16T00:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-17T23:59:59'),
                    title: 'Event 3',
                    allDay: true,
                },
            ];
            render(<standalone_view_1.StandaloneView events={overlappingEvents} resources={[]}>
          <month_view_1.MonthView />
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
            // Rows in the month view always have +1 since row 1 is occupied by the day number
            expect(event1GridRow).to.equal('2');
            expect(event2GridRow).to.equal('3');
            expect(event3GridRow).to.equal('2');
        });
        it('should render all-day events with correct grid column span', function () {
            var _a;
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <month_view_1.MonthView />
        </standalone_view_1.StandaloneView>);
            var mainEvent = internal_test_utils_1.screen
                .getAllByLabelText('Three Day Event')
                .find(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            var eventStyle = (mainEvent === null || mainEvent === void 0 ? void 0 : mainEvent.getAttribute('style')) || '';
            var gridColumnSpan = (_a = eventStyle.match(/--grid-column-span:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
            // Should span 3 columns (3 days)
            expect(gridColumnSpan).to.equal('3');
        });
        it('should render one visible event per row if event spans across multiple weeks', function () {
            render(<standalone_view_1.StandaloneView events={allDayEvents} resources={[]}>
          <month_view_1.MonthView />
        </standalone_view_1.StandaloneView>);
            var eventInstances = internal_test_utils_1.screen.getAllByLabelText('Multiple week event');
            var visibleInstances = eventInstances.filter(function (el) { return el.getAttribute('aria-hidden') !== 'true'; });
            expect(visibleInstances).toHaveLength(2);
        });
    });
});
