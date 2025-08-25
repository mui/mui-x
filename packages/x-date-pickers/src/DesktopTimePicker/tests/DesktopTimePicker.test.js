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
var DesktopTimePicker_1 = require("@mui/x-date-pickers/DesktopTimePicker");
var pickers_1 = require("test/utils/pickers");
describe('<DesktopTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('rendering behavior', function () {
        it('should render "accept" action and 3 time sections by default', function () {
            render(<DesktopTimePicker_1.DesktopTimePicker open/>);
            expect(internal_test_utils_1.screen.getByRole('button', { name: 'OK' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('listbox', { name: 'Select hours' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('option', { name: '1 hours' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('listbox', { name: 'Select minutes' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('option', { name: '5 minutes' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('listbox', { name: 'Select meridiem' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('option', { name: 'AM' })).not.to.equal(null);
        });
        it('should render single column Picker given big enough "thresholdToRenderTimeInASingleColumn" number', function () {
            render(<DesktopTimePicker_1.DesktopTimePicker open thresholdToRenderTimeInASingleColumn={1000}/>);
            expect(internal_test_utils_1.screen.getByRole('listbox', { name: 'Select time' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('option', { name: '09:35 AM' })).not.to.equal(null);
        });
        it('should render single column Picker given big enough "timeSteps.minutes" number', function () {
            render(<DesktopTimePicker_1.DesktopTimePicker open timeSteps={{ minutes: 60 }}/>);
            expect(internal_test_utils_1.screen.getByRole('listbox', { name: 'Select time' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('option', { name: '09:00 AM' })).not.to.equal(null);
        });
        it('should correctly use all "timeSteps"', function () {
            render(<DesktopTimePicker_1.DesktopTimePicker open views={['hours', 'minutes', 'seconds']} timeSteps={{ hours: 3, minutes: 15, seconds: 20 }}/>);
            Array.from({ length: 12 / 3 }).forEach(function (_, i) {
                expect(internal_test_utils_1.screen.getByRole('option', { name: "".concat(i * 3 || 12, " hours") })).not.to.equal(null);
            });
            Array.from({ length: 60 / 15 }).forEach(function (_, i) {
                expect(internal_test_utils_1.screen.getByRole('option', { name: "".concat(i * 15, " minutes") })).not.to.equal(null);
            });
            Array.from({ length: 60 / 20 }).forEach(function (_, i) {
                expect(internal_test_utils_1.screen.getByRole('option', { name: "".concat(i * 20, " seconds") })).not.to.equal(null);
            });
        });
    });
    describe('selecting behavior', function () {
        it('should call "onAccept", "onChange", and "onClose" when selecting a single option', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopTimePicker_1.DesktopTimePicker timeSteps={{ minutes: 60 }} onChange={onChange} onAccept={onAccept} onClose={onClose} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'time' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '09:00 AM' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1, 9, 0));
                        // closeOnSelect false by default
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 3:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call "onAccept", "onChange", and "onClose" when selecting all section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopTimePicker_1.DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'time' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '2 hours' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' }))];
                    case 3:
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                    case 4:
                        _a.sent();
                        expect(onChange.callCount).to.equal(3);
                        // closeOnSelect false by default
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 5:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow out of order section selection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopTimePicker_1.DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'time' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '2 hours' }))];
                    case 3:
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '25 minutes' }))];
                    case 4:
                        _a.sent();
                        expect(onChange.callCount).to.equal(3);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                    case 5:
                        _a.sent();
                        expect(onChange.callCount).to.equal(4);
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
        it('should finish selection when selecting only the last section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopTimePicker_1.DesktopTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} referenceDate={pickers_1.adapterToUse.date('2018-01-01')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'time' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        // closeOnSelect false by default
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Click on 'accept' action to close the picker
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/ok/i))];
                    case 3:
                        // Click on 'accept' action to close the picker
                        _a.sent();
                        expect(onAccept.callCount).to.equal(1);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
