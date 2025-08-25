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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var scheduler_1 = require("test/utils/scheduler");
var event_calendar_1 = require("@mui/x-scheduler/material/event-calendar");
var test_utils_1 = require("../internals/utils/test-utils");
describe('EventCalendar', function () {
    var render = (0, scheduler_1.createSchedulerRenderer)({ clockConfig: new Date('2025-05-26') }).render;
    // TODO: Move in a test file specific to the TimeGrid component.
    it('should render events in the correct column', function () {
        render(<event_calendar_1.EventCalendar events={[
                {
                    id: '1',
                    start: luxon_1.DateTime.fromISO('2025-05-26T07:30:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-26T08:15:00'),
                    title: 'Running',
                },
                {
                    id: '2',
                    start: luxon_1.DateTime.fromISO('2025-05-27T16:00:00'),
                    end: luxon_1.DateTime.fromISO('2025-05-27T17:00:00'),
                    title: 'Weekly',
                },
            ]}/>);
        var mondayEvent = internal_test_utils_1.screen.getByRole('button', { name: /Running/i });
        var tuesdayEvent = internal_test_utils_1.screen.getByRole('button', { name: /Weekly/i });
        expect(mondayEvent).not.to.equal(null);
        expect(tuesdayEvent).not.to.equal(null);
        expect(mondayEvent.textContent).to.equal('Running7:30 AM');
        expect(tuesdayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');
        expect(mondayEvent.getAttribute('aria-labelledby')).to.include('DayTimeGridHeaderCell-26');
        expect(tuesdayEvent.getAttribute('aria-labelledby')).to.include('DayTimeGridHeaderCell-27');
        expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Monday 26/i })).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Tuesday 27/i })).not.to.equal(null);
    });
    it('should allow to show / hide resources using the UI', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, workResourceToggleButton, sportResourceToggleButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<event_calendar_1.EventCalendar events={[
                            {
                                id: '1',
                                start: luxon_1.DateTime.fromISO('2025-05-26T07:30:00'),
                                end: luxon_1.DateTime.fromISO('2025-05-26T08:15:00'),
                                title: 'Running',
                                resource: '1',
                            },
                            {
                                id: '2',
                                start: luxon_1.DateTime.fromISO('2025-05-27T16:00:00'),
                                end: luxon_1.DateTime.fromISO('2025-05-27T17:00:00'),
                                title: 'Weekly',
                                resource: '2',
                            },
                        ]} resources={[
                            { id: '1', name: 'Sport' },
                            { id: '2', name: 'Work' },
                        ]}/>).user;
                    workResourceToggleButton = internal_test_utils_1.screen.getByRole('checkbox', { name: /Work/i });
                    sportResourceToggleButton = internal_test_utils_1.screen.getByRole('checkbox', { name: /Sport/i });
                    expect(workResourceToggleButton).to.have.attribute('data-checked');
                    expect(sportResourceToggleButton).to.have.attribute('data-checked');
                    expect(internal_test_utils_1.screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.queryByRole('button', { name: /Weekly/i })).not.to.equal(null);
                    return [4 /*yield*/, user.click(workResourceToggleButton)];
                case 1:
                    _a.sent();
                    expect(workResourceToggleButton).not.to.have.attribute('data-checked');
                    expect(internal_test_utils_1.screen.queryByRole('button', { name: /Weekly/i })).to.equal(null);
                    return [4 /*yield*/, user.click(sportResourceToggleButton)];
                case 2:
                    _a.sent();
                    expect(sportResourceToggleButton).not.to.have.attribute('data-checked');
                    expect(internal_test_utils_1.screen.queryByRole('button', { name: /Running/i })).to.equal(null);
                    return [4 /*yield*/, user.click(workResourceToggleButton)];
                case 3:
                    _a.sent();
                    expect(workResourceToggleButton).to.have.attribute('data-checked');
                    expect(internal_test_utils_1.screen.getByRole('button', { name: /Weekly/i })).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to show / hide the weekends using the UI in the week view', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<event_calendar_1.EventCalendar events={[]}/>).user;
                    // Weekends should be visible by default
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);
                    // Hide the weekends
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 1:
                    // Hide the weekends
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByRole('columnheader', { name: /Sunday 25/i })).to.equal(null);
                    expect(internal_test_utils_1.screen.queryByRole('columnheader', { name: /Saturday 31/i })).to.equal(null);
                    // Show the weekends again
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 3:
                    // Show the weekends again
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 4:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to show / hide the weekends using the UI in the month view', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<event_calendar_1.EventCalendar events={[]} defaultView="month"/>).user;
                    // Weekends should be visible by default
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);
                    // Hide the weekends
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 1:
                    // Hide the weekends
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByRole('columnheader', { name: /Sunday/i })).to.equal(null);
                    expect(internal_test_utils_1.screen.queryByRole('columnheader', { name: /Saturday/i })).to.equal(null);
                    // Show the weekends again
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 3:
                    // Show the weekends again
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 4:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to show / hide the weekends using the UI in the agenda view', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<event_calendar_1.EventCalendar events={[]} defaultView="agenda"/>).user;
                    // Weekends should be visible by default
                    expect(internal_test_utils_1.screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);
                    // Hide the weekends
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 1:
                    // Hide the weekends
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByLabelText(/Saturday 31/i)).to.equal(null);
                    expect(internal_test_utils_1.screen.queryByLabelText(/Sunday 1/i)).to.equal(null);
                    // Show the weekends again
                    return [4 /*yield*/, (0, test_utils_1.openSettingsMenu)(user)];
                case 3:
                    // Show the weekends again
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.toggleHideWeekends)(user)];
                case 4:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
                    expect(internal_test_utils_1.screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
