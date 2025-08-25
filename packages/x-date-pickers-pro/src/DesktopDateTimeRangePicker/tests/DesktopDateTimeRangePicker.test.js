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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var DesktopDateTimeRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateTimeRangePicker");
describe('<DesktopDateTimeRangePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    beforeEach(function () {
        vitest_1.vi.setSystemTime(new Date(2018, 0, 10, 10, 16, 0));
    });
    afterEach(function () {
        vitest_1.vi.useRealTimers();
    });
    describe('value selection', function () {
        it('should allow to select range within the same day', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, sectionsContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker />).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-time-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        // select start date range
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' }))];
                    case 2:
                        // select start date range
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '4 hours' }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '5 minutes' }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Next' }))];
                    case 6:
                        _a.sent();
                        // select end date range on the same day
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' }))];
                    case 7:
                        // select end date range on the same day
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '5 hours' }))];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: '10 minutes' }))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('option', { name: 'PM' }))];
                    case 10:
                        _a.sent();
                        sectionsContainer = (0, pickers_1.getFieldSectionsContainer)();
                        (0, pickers_1.expectFieldValueV7)(sectionsContainer, '01/11/2018 04:05 PM – 01/11/2018 05:10 PM');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use time from `referenceDate` when selecting the day', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, sectionsContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker referenceDate={pickers_1.adapterToUse.date('2022-04-14T14:15:00')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-time-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' }))];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '2 hours', selected: true })).not.to.equal(null);
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes', selected: true })).not.to.equal(null);
                        expect(internal_test_utils_1.screen.getByRole('option', { name: 'PM', selected: true })).not.to.equal(null);
                        sectionsContainer = (0, pickers_1.getFieldSectionsContainer)();
                        (0, pickers_1.expectFieldValueV7)(sectionsContainer, '04/11/2022 02:15 PM – MM/DD/YYYY hh:mm aa');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cycle focused views among the visible step after selection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, day, hours, minutes, meridiem, sectionsContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker />).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-time-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
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
                        (0, pickers_1.expectFieldValueV7)(sectionsContainer, '01/10/2018 12:00 AM – MM/DD/YYYY hh:mm aa');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with separate start and end "reference" dates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker referenceDate={[
                                pickers_1.adapterToUse.date('2018-01-01T10:15:00'),
                                pickers_1.adapterToUse.date('2018-01-06T14:20:00'),
                            ]}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-time-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(document.activeElement).to.equal(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }))];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours', selected: true })).not.to.equal(null);
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes', selected: true })).not.to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Next' }))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 4:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '2 hours', selected: true })).not.to.equal(null);
                        expect(internal_test_utils_1.screen.getByRole('option', { name: '20 minutes', selected: true })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('disabled dates', function () {
        it('should respect the "disablePast" prop', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker disablePast open/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '9 hours' })).to.have.attribute('aria-disabled', 'true');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' })).to.have.attribute('aria-disabled', 'true');
        });
        // Asserts correct behavior: https://github.com/mui/mui-x/issues/12048
        it('should respect the "disablePast" prop combined with "referenceDate"', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker disablePast open referenceDate={pickers_1.adapterToUse.date('2018-01-11')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '9 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' })).not.to.have.attribute('aria-disabled');
        });
        it('should respect the "disableFuture" prop', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker disableFuture open/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '11 hours' })).to.have.attribute('aria-disabled', 'true');
        });
        // Asserts correct behavior: https://github.com/mui/mui-x/issues/12048
        it('should respect the "disableFuture" prop combined with "referenceDate"', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker disableFuture open referenceDate={pickers_1.adapterToUse.date('2018-01-09')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '11 hours' })).not.to.have.attribute('aria-disabled');
        });
        it('should respect the "minDateTime" prop', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker minDateTime={pickers_1.adapterToUse.date('2018-01-10T10:16:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-10T10:00:00')} open/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '9 hours' })).to.have.attribute('aria-disabled', 'true');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' })).to.have.attribute('aria-disabled', 'true');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '20 minutes' })).not.to.have.attribute('aria-disabled');
        });
        it('should respect the "maxDateTime" prop', function () {
            render(<DesktopDateTimeRangePicker_1.DesktopDateTimeRangePicker maxDateTime={pickers_1.adapterToUse.date('2018-01-10T10:16:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-10T10:00:00')} open/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '11 hours' })).to.have.attribute('aria-disabled', 'true');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '15 minutes' })).not.to.have.attribute('aria-disabled');
            expect(internal_test_utils_1.screen.getByRole('option', { name: '20 minutes' })).to.have.attribute('aria-disabled', 'true');
        });
    });
});
