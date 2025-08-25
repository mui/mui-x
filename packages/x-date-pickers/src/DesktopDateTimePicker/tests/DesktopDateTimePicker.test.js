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
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DesktopDateTimePicker_1 = require("@mui/x-date-pickers/DesktopDateTimePicker");
var pickers_1 = require("test/utils/pickers");
describe('<DesktopDateTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('picker state', function () {
        it('should open when clicking "Choose date"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker onOpen={onOpen} defaultValue={null}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/Choose date/))];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.queryByRole('dialog')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onAccept when selecting the same date and time after changing the year', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={pickers_1.adapterToUse.date('2018-01-01T11:55:00')} openTo="year"/>).user;
                        (0, pickers_1.openPicker)({ type: 'date-time' });
                        // Select year
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('radio', { name: '2025' }))];
                    case 1:
                        // Select year
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1, 11, 55));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the date (same value)
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }))];
                    case 2:
                        // Change the date (same value)
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
                        // Change the hours (same value)
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '11 hours' }))];
                    case 3:
                        // Change the hours (same value)
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
                        // Change the minutes (same value)
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '55 minutes' }))];
                    case 4:
                        // Change the minutes (same value)
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
                        // Change the meridiem (same value)
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'AM' }))];
                    case 5:
                        // Change the meridiem (same value)
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
                        // closeOnSelect false by default
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 6:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should allow selecting same view multiple times', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange, onAccept, onClose, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange = (0, sinon_1.spy)();
                    onAccept = (0, sinon_1.spy)();
                    onClose = (0, sinon_1.spy)();
                    user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={pickers_1.adapterToUse.date('2018-01-01T11:55:00')}/>).user;
                    (0, pickers_1.openPicker)({ type: 'date-time' });
                    // Change the date multiple times to check that Picker doesn't close after cycling through all views internally
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                case 1:
                    // Change the date multiple times to check that Picker doesn't close after cycling through all views internally
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '4' }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' }))];
                case 4:
                    _a.sent();
                    expect(onChange.callCount).to.equal(4);
                    expect(onAccept.callCount).to.equal(0);
                    expect(onClose.callCount).to.equal(0);
                    // Change the hours
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' }))];
                case 5:
                    // Change the hours
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '9 hours' }))];
                case 6:
                    _a.sent();
                    expect(onChange.callCount).to.equal(6);
                    expect(onAccept.callCount).to.equal(0);
                    expect(onClose.callCount).to.equal(0);
                    // Change the minutes
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '50 minutes' }))];
                case 7:
                    // Change the minutes
                    _a.sent();
                    expect(onChange.callCount).to.equal(7);
                    // Change the meridiem
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                case 8:
                    // Change the meridiem
                    _a.sent();
                    expect(onChange.callCount).to.equal(8);
                    // closeOnSelect false by default
                    expect(onAccept.callCount).to.equal(0);
                    expect(onClose.callCount).to.equal(0);
                    // Click on 'accept' action to close the picker
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                case 9:
                    // Click on 'accept' action to close the picker
                    _a.sent();
                    expect(onAccept.callCount).to.equal(1);
                    expect(onClose.callCount).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should cycle focused views among the visible step after selection', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, day, hours, minutes, meridiem, sectionsContainer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker referenceDate={pickers_1.adapterToUse.date('2018-01-10')}/>).user;
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date-time' })];
                case 1:
                    _a.sent();
                    day = internal_test_utils_1.screen.getByRole('gridcell', { name: '10' });
                    expect(day).toHaveFocus();
                    return [4 /*yield*/, user.click(day)];
                case 2:
                    _a.sent();
                    hours = internal_test_utils_1.screen.getByRole('option', { name: '12 hours' });
                    expect(hours).toHaveFocus();
                    return [4 /*yield*/, user.click(hours)];
                case 3:
                    _a.sent();
                    minutes = internal_test_utils_1.screen.getByRole('option', { name: '0 minutes' });
                    expect(minutes).toHaveFocus();
                    return [4 /*yield*/, user.click(minutes)];
                case 4:
                    _a.sent();
                    meridiem = internal_test_utils_1.screen.getByRole('option', { name: 'AM' });
                    expect(meridiem).toHaveFocus();
                    sectionsContainer = (0, pickers_1.getFieldSectionsContainer)();
                    (0, pickers_1.expectFieldValueV7)(sectionsContainer, '01/10/2018 12:00 AM');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('prop: timeSteps', function () {
        it('should use "DigitalClock" view renderer, when "timeSteps.minutes" = 60', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker onChange={onChange} onAccept={onAccept} timeSteps={{ minutes: 60 }} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/Choose date/))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '03:00 AM' }))];
                    case 3:
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 2, 3, 0, 0));
                        expect(onAccept.callCount).to.equal(0); // onAccept false by default
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 4:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should accept value and close Picker when selecting time on "DigitalClock" view renderer', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        user = render(<DesktopDateTimePicker_1.DesktopDateTimePicker onChange={onChange} onAccept={onAccept} timeSteps={{ minutes: 60 }} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/Choose date/))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '03:00 AM' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 3, 0, 0));
                        expect(onAccept.callCount).to.equal(0); // onAccept false by default
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 3:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
