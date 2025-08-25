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
var MobileDateRangePicker_1 = require("@mui/x-date-pickers-pro/MobileDateRangePicker");
var pickers_1 = require("test/utils/pickers");
var SingleInputDateRangeField_1 = require("@mui/x-date-pickers-pro/SingleInputDateRangeField");
var MultiInputDateRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateRangeField");
describe('<MobileDateRangePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('Field slot: SingleInputDateRangeField', function () {
        it('should render the input with a given `name` when `SingleInputDateRangeField` is used', function () {
            // Test with accessible DOM structure
            var unmount = render(<MobileDateRangePicker_1.MobileDateRangePicker name="test" slots={{ field: SingleInputDateRangeField_1.SingleInputDateRangeField }}/>).unmount;
            expect(internal_test_utils_1.screen.getByRole('textbox', { hidden: true }).name).to.equal('test');
            unmount();
            // Test with non-accessible DOM structure
            render(<MobileDateRangePicker_1.MobileDateRangePicker enableAccessibleFieldDOMStructure={false} name="test" slots={{ field: SingleInputDateRangeField_1.SingleInputDateRangeField }}/>);
            expect(internal_test_utils_1.screen.getByRole('textbox').name).to.equal('test');
        });
    });
    describe('picker state', function () {
        it('should open when focusing the start input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<MobileDateRangePicker_1.MobileDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.queryByRole('dialog')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should open when focusing the end input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<MobileDateRangePicker_1.MobileDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.queryByRole('dialog')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onChange with updated start date then call onChange with updated end date when opening from start input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue}/>).user;
                        // Open the picker
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        // Open the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the start date
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
                        // Change the end date
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' }));
                        expect(onChange.callCount).to.equal(2);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onChange with updated end date when opening from end input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Open the picker
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        // Open the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the end date
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose and onAccept when selecting the end date if props.closeOnSelect = true (multi input field)', function () {
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var defaultValue = [
                pickers_1.adapterToUse.date('2018-01-01'),
                pickers_1.adapterToUse.date('2018-01-06'),
            ];
            render(<MobileDateRangePicker_1.MobileDateRangePicker onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} closeOnSelect slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>);
            (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'end', fieldType: 'multi-input' });
            // Change the end date
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
            expect(onAccept.callCount).to.equal(1);
            expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
            expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
            expect(onClose.callCount).to.equal(1);
        });
        it('should call onClose and onChange with the initial value when clicking "Cancel" button', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var defaultValue = [
                pickers_1.adapterToUse.date('2018-01-01'),
                pickers_1.adapterToUse.date('2018-01-06'),
            ];
            render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slotProps={{ actionBar: { actions: ['cancel'] } }}/>);
            (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
            // Change the start date (already tested)
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
            // Cancel the modifications
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/cancel/i));
            expect(onChange.callCount).to.equal(2); // Start date change + reset
            expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
            expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(1);
        });
        it('should call onClose and onAccept with the live value and onAccept with the live value when clicking the "OK"', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var defaultValue = [
                pickers_1.adapterToUse.date('2018-01-01'),
                pickers_1.adapterToUse.date('2018-01-06'),
            ];
            render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue}/>);
            (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
            // Change the start date (already tested)
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
            // Accept the modifications
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/ok/i));
            expect(onChange.callCount).to.equal(1); // Start date change
            expect(onAccept.callCount).to.equal(1);
            expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
            expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
            expect(onClose.callCount).to.equal(1);
        });
        it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var defaultValue = [
                pickers_1.adapterToUse.date('2018-01-01'),
                pickers_1.adapterToUse.date('2018-01-06'),
            ];
            render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slotProps={{ actionBar: { actions: ['clear'] } }}/>);
            (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
            // Clear the date
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/clear/i));
            expect(onChange.callCount).to.equal(1); // Start date change
            expect(onChange.lastCall.args[0]).to.deep.equal([null, null]);
            expect(onAccept.callCount).to.equal(1);
            expect(onAccept.lastCall.args[0]).to.deep.equal([null, null]);
            expect(onClose.callCount).to.equal(1);
        });
        it('should not call onChange or onAccept when pressing "Clear" button with an already null value', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<MobileDateRangePicker_1.MobileDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} slotProps={{ actionBar: { actions: ['clear'] } }} value={[null, null]}/>);
            (0, pickers_1.openPicker)({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
            // Clear the date
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/clear/i));
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(1);
        });
        it('should correctly set focused styles when input is focused', function () {
            render(<MobileDateRangePicker_1.MobileDateRangePicker label="Picker"/>);
            var sectionsContainer = (0, pickers_1.getFieldSectionsContainer)();
            internal_test_utils_1.fireEvent.focus(sectionsContainer);
            expect(internal_test_utils_1.screen.getByText('Picker', { selector: 'label' })).to.have.class('Mui-focused');
        });
    });
    it('should ignore "currentMonthCalendarPosition" prop value and have expected selection behavior', function () {
        render(<MobileDateRangePicker_1.MobileDateRangePicker currentMonthCalendarPosition={2} open referenceDate={pickers_1.adapterToUse.date('2022-04-17')}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }));
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' }));
        expect(internal_test_utils_1.screen.getByText('Apr 3')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByText('Apr 5')).not.to.equal(null);
    });
    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
});
