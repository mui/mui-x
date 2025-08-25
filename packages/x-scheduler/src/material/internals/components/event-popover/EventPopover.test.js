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
var standalone_view_1 = require("@mui/x-scheduler/material/standalone-view");
var sinon_1 = require("sinon");
var popover_1 = require("@base-ui-components/react/popover");
var EventPopover_1 = require("./EventPopover");
var calendarEvent = {
    id: '1',
    start: luxon_1.DateTime.fromISO('2025-05-26T07:30:00'),
    end: luxon_1.DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Running',
    description: 'Morning run',
};
var calendarEventResource = {
    id: 'r1',
    name: 'Personal',
    color: 'cyan',
};
describe('<EventPopover />', function () {
    var anchor = document.createElement('button');
    document.body.appendChild(anchor);
    var defaultProps = {
        anchor: anchor,
        container: document.body,
        calendarEvent: calendarEvent,
        calendarEventResource: calendarEventResource,
        onClose: function () { },
    };
    var render = (0, scheduler_1.createSchedulerRenderer)().render;
    it('should render the event data in the form fields', function () {
        render(<standalone_view_1.StandaloneView events={[calendarEvent]}>
        <popover_1.Popover.Root open>
          <EventPopover_1.EventPopover {...defaultProps}/>
        </popover_1.Popover.Root>
      </standalone_view_1.StandaloneView>);
        expect(internal_test_utils_1.screen.getByDisplayValue('Running')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByDisplayValue('Morning run')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
        expect(internal_test_utils_1.screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
        expect(internal_test_utils_1.screen.getByLabelText(/start time/i)).to.have.value('07:30');
        expect(internal_test_utils_1.screen.getByLabelText(/end time/i)).to.have.value('08:15');
        expect(internal_test_utils_1.screen.getByRole('checkbox', { name: /all day/i })).to.have.attribute('aria-checked', 'false');
    });
    it('should call "onEventsChange" with updated values on submit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEventsChange, user, _a, _b, updated;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onEventsChange = (0, sinon_1.spy)();
                    user = render(<standalone_view_1.StandaloneView events={[calendarEvent]} onEventsChange={onEventsChange}>
        <popover_1.Popover.Root open>
          <EventPopover_1.EventPopover {...defaultProps}/>
        </popover_1.Popover.Root>
      </standalone_view_1.StandaloneView>).user;
                    return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByLabelText(/event title/i), ' test')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /all day/i }))];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('combobox', { name: /recurrence/i }))];
                case 3:
                    _d.sent();
                    _b = (_a = user).click;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('option', { name: /repeats daily/i })];
                case 4: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /save changes/i }))];
                case 6:
                    _d.sent();
                    expect(onEventsChange.calledOnce).to.equal(true);
                    updated = onEventsChange.firstCall.firstArg[0];
                    expect(updated.title).to.equal('Running test');
                    expect((_c = updated.rrule) === null || _c === void 0 ? void 0 : _c.freq).to.equal('DAILY');
                    expect(updated.allDay).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should show error if start date is after end date', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<standalone_view_1.StandaloneView events={[calendarEvent]}>
        <popover_1.Popover.Root open>
          <EventPopover_1.EventPopover {...defaultProps}/>
        </popover_1.Popover.Root>
      </standalone_view_1.StandaloneView>).user;
                    return [4 /*yield*/, user.clear(internal_test_utils_1.screen.getByLabelText(/start date/i))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByLabelText(/start date/i), '2025-05-27')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user.clear(internal_test_utils_1.screen.getByLabelText(/end date/i))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByLabelText(/end date/i), '2025-05-26')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /save changes/i }))];
                case 5:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getDescriptionOf(internal_test_utils_1.screen.getByLabelText(/start date/i)).textContent).to.match(/start.*before.*end/i);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call "onEventsChange" with the updated values when delete button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onEventsChange, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onEventsChange = (0, sinon_1.spy)();
                    user = render(<standalone_view_1.StandaloneView events={[calendarEvent]} onEventsChange={onEventsChange}>
        <popover_1.Popover.Root open>
          <EventPopover_1.EventPopover {...defaultProps}/>
        </popover_1.Popover.Root>
      </standalone_view_1.StandaloneView>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /delete event/i }))];
                case 1:
                    _a.sent();
                    expect(onEventsChange.calledOnce).to.equal(true);
                    expect(onEventsChange.firstCall.firstArg).to.deep.equal([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle read-only events', function () {
        render(<standalone_view_1.StandaloneView events={[calendarEvent]}>
        <popover_1.Popover.Root open>
          <EventPopover_1.EventPopover {...defaultProps} calendarEvent={__assign(__assign({}, calendarEvent), { readOnly: true })}/>
        </popover_1.Popover.Root>
      </standalone_view_1.StandaloneView>);
        expect(internal_test_utils_1.screen.getByDisplayValue('Running')).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.getByDisplayValue('Morning run')).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.getByLabelText(/start date/i)).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.getByLabelText(/end date/i)).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.getByLabelText(/start time/i)).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.getByLabelText(/end time/i)).to.have.attribute('readonly');
        expect(internal_test_utils_1.screen.queryByRole('button', { name: /save changes/i })).to.equal(null);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: /delete event/i })).to.equal(null);
    });
});
