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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPickerOpenCloseLifeCycle = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var react_transition_group_1 = require("react-transition-group");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var fireUserEvent_1 = require("../../fireUserEvent");
var testPickerOpenCloseLifeCycle = function (ElementToTest, options) {
    var componentFamily = options.componentFamily, render = options.render, renderWithProps = options.renderWithProps, values = options.values, setNewValue = options.setNewValue, pickerParams = __rest(options, ["componentFamily", "render", "renderWithProps", "values", "setNewValue"]);
    var isRangeType = (0, pickers_1.isPickerRangeType)(pickerParams.type);
    var viewWrapperRole = (0, pickers_1.isPickerSingleInput)(options) || pickerParams.variant === 'mobile' ? 'dialog' : 'tooltip';
    var shouldCloseOnSelect = (pickerParams.type === 'date' || pickerParams.type === 'date-range') &&
        pickerParams.variant === 'desktop';
    describe.skipIf(componentFamily !== 'picker')('Picker open / close lifecycle', function () {
        it('should not open on mount if `props.open` is false', function () {
            render(<ElementToTest />);
            expect(internal_test_utils_1.screen.queryByRole(viewWrapperRole)).to.equal(null);
        });
        it('should open on mount if `prop.open` is true', function () {
            render(<ElementToTest open/>);
            expect(internal_test_utils_1.screen.queryByRole(viewWrapperRole)).toBeVisible();
        });
        it('should not open when `prop.disabled` is true ', function () {
            var onOpen = (0, sinon_1.spy)();
            render(<ElementToTest disabled onOpen={onOpen}/>);
            (0, pickers_1.openPicker)(pickerParams);
            expect(onOpen.callCount).to.equal(0);
        });
        it('should not open when `prop.readOnly` is true ', function () {
            var onOpen = (0, sinon_1.spy)();
            render(<ElementToTest readOnly onOpen={onOpen}/>);
            (0, pickers_1.openPicker)(pickerParams);
            expect(onOpen.callCount).to.equal(0);
        });
        it('should call onChange, onClose and onAccept (if Desktop Date Picker or Desktop Date Range Picker) when selecting a value', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var _a = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                onAccept: onAccept,
                onClose: onClose,
                defaultValue: values[0],
                open: true,
            }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
            // Change the value
            var newValue = setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
            expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams));
            if (isRangeType) {
                newValue = setNewValue(newValue, {
                    isOpened: true,
                    setEndDate: true,
                    selectSection: selectSection,
                    pressKey: pressKey,
                });
                newValue.forEach(function (value, index) {
                    expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                });
            }
            else {
                expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
            }
            expect(onAccept.callCount).to.equal(!shouldCloseOnSelect ? 0 : 1);
            expect(onClose.callCount).to.equal(!shouldCloseOnSelect ? 0 : 1);
        });
        it.skipIf(pickerParams.variant !== 'mobile')('should not select input content after closing on mobile', function () {
            var _a = renderWithProps({ enableAccessibleFieldDOMStructure: true, defaultValue: values[0] }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            // Change the value
            setNewValue(values[0], { selectSection: selectSection, pressKey: pressKey, closeMobilePicker: true });
            var fieldRoot = (0, pickers_1.getFieldInputRoot)();
            expect(fieldRoot.scrollLeft).to.be.equal(0);
        });
        it('should call onChange, onClose and onAccept when selecting a value and `props.closeOnSelect` is true', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var _a = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                onAccept: onAccept,
                onClose: onClose,
                defaultValue: values[0],
                open: true,
                closeOnSelect: true,
            }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
            // Change the value
            var newValue = setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
            expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams));
            if (isRangeType) {
                newValue = setNewValue(newValue, {
                    isOpened: true,
                    setEndDate: true,
                    selectSection: selectSection,
                    pressKey: pressKey,
                });
                newValue.forEach(function (value, index) {
                    expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                });
            }
            else {
                expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
            }
            expect(onAccept.callCount).to.equal(1);
            expect(onClose.callCount).to.equal(1);
        });
        it('should not call onChange or onAccept when selecting the same value', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var _a = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                onAccept: onAccept,
                onClose: onClose,
                open: true,
                value: values[0],
                closeOnSelect: true,
            }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            // Change the value (same value)
            setNewValue(values[0], { isOpened: true, applySameValue: true, selectSection: selectSection, pressKey: pressKey });
            if (isRangeType) {
                setNewValue(values[0], {
                    isOpened: true,
                    applySameValue: true,
                    setEndDate: true,
                    selectSection: selectSection,
                    pressKey: pressKey,
                });
            }
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(1);
        });
        it('should not call onClose or onAccept when selecting a date and `props.closeOnSelect` is false', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var _a = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                onAccept: onAccept,
                onClose: onClose,
                defaultValue: values[0],
                open: true,
                closeOnSelect: false,
            }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            // Change the value
            var newValue = setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
            var initialChangeCount = (0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams);
            expect(onChange.callCount).to.equal(initialChangeCount);
            if (isRangeType) {
                newValue = setNewValue(newValue, {
                    isOpened: true,
                    setEndDate: true,
                    selectSection: selectSection,
                    pressKey: pressKey,
                });
                newValue.forEach(function (value, index) {
                    expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                });
            }
            else {
                expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
            }
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
            // Change the value
            var newValueBis = setNewValue(newValue, { isOpened: true, selectSection: selectSection, pressKey: pressKey });
            if (isRangeType) {
                expect(onChange.callCount).to.equal(initialChangeCount +
                    (0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams) * 2 -
                    (pickerParams.type === 'date-time-range' || pickerParams.type === 'time-range' ? 1 : 0));
                newValueBis = setNewValue(newValueBis, {
                    isOpened: true,
                    setEndDate: true,
                    selectSection: selectSection,
                    pressKey: pressKey,
                });
                newValueBis.forEach(function (value, index) {
                    expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                });
            }
            else {
                expect(onChange.callCount).to.equal(initialChangeCount +
                    (0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams) -
                    // meridiem does not change this time in case of multi section digital clock
                    (pickerParams.type === 'time' || pickerParams.type === 'date-time' ? 1 : 0));
                expect(onChange.lastCall.args[0]).toEqualDateTime(newValueBis);
            }
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
        });
        it('should call onClose and onAccept with the live value when pressing Escape', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, _a, selectSection, pressKey, user, newValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        _a = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            onChange: onChange,
                            onAccept: onAccept,
                            onClose: onClose,
                            defaultValue: values[0],
                            open: true,
                            closeOnSelect: false,
                        }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey, user = _a.user;
                        newValue = setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 1:
                        // Dismiss the picker
                        _b.sent();
                        expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams));
                        expect(onAccept.callCount).to.equal(1);
                        if (isRangeType) {
                            newValue.forEach(function (value, index) {
                                expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                            });
                        }
                        else {
                            expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
                        }
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: Fix this test and enable it on mobile and date-range
        it.skipIf(pickerParams.variant === 'mobile' || isRangeType)('should call onClose when clicking outside of the picker without prior change', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} value={values[0]} open closeOnSelect={false}/>);
            // Dismiss the picker
            fireUserEvent_1.fireUserEvent.mousePress(document.body);
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(1);
        });
        // TODO: Fix this test and enable it on mobile and date-range
        it.skipIf(pickerParams.variant === 'mobile' || isRangeType)('should call onClose and onAccept with the live value when clicking outside of the picker', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            var _a = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                onChange: onChange,
                onAccept: onAccept,
                onClose: onClose,
                defaultValue: values[0],
                open: true,
                closeOnSelect: false,
            }, { componentFamily: componentFamily }), selectSection = _a.selectSection, pressKey = _a.pressKey;
            // Change the value (already tested)
            var newValue = setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
            // Dismiss the picker
            fireUserEvent_1.fireUserEvent.keyPress(document.activeElement, { key: 'Escape' });
            expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams));
            expect(onAccept.callCount).to.equal(1);
            expect(onAccept.lastCall.args[0]).toEqualDateTime(newValue);
            expect(onClose.callCount).to.equal(1);
        });
        it('should not call onClose or onAccept when clicking outside of the picker if not opened', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} closeOnSelect={false}/>);
            // Dismiss the picker
            internal_test_utils_1.fireEvent.click(document.body);
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
        });
        it('should not call onClose or onAccept when pressing escape when picker is not opened', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose}/>);
            // Dismiss the picker
            internal_test_utils_1.fireEvent.keyDown(document.body, { key: 'Escape' });
            expect(onChange.callCount).to.equal(0);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
        });
    });
    it.skipIf(!['date-range', 'time-range', 'date-time-range'].includes(pickerParams.type) ||
        pickerParams.fieldType !== 'single-input')('should return back to start range position after reopening a range picker', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pickerType, user, isDateTimeRangePicker, toolbarButtons, toolbarButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pickerType = pickerParams.type;
                    // If transitions are disabled, the `onExited` event is not triggered
                    react_transition_group_1.config.disabled = false;
                    user = render(<ElementToTest slotProps={{ toolbar: { hidden: false } }}/>).user;
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: pickerType,
                            fieldType: 'single-input',
                            initialFocus: 'start',
                        })];
                case 1:
                    _a.sent();
                    isDateTimeRangePicker = pickerParams.type === 'date-time-range';
                    if (!isDateTimeRangePicker) return [3 /*break*/, 3];
                    // click the end date toolbar button
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByTestId('datetimepicker-toolbar-day')[1])];
                case 2:
                    // click the end date toolbar button
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    toolbarButtons = internal_test_utils_1.screen.getAllByTestId('toolbar-button');
                    // click the first button of the end toolbar
                    return [4 /*yield*/, user.click(toolbarButtons[toolbarButtons.length / 2])];
                case 4:
                    // click the first button of the end toolbar
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, user.keyboard('[Escape]')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(internal_test_utils_1.screen.queryByRole(viewWrapperRole)).to.equal(null); })];
                case 7:
                    _a.sent();
                    // open the picker again
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: pickerType,
                            fieldType: 'single-input',
                            initialFocus: 'start',
                        })];
                case 8:
                    // open the picker again
                    _a.sent();
                    if (isDateTimeRangePicker) {
                        toolbarButton = internal_test_utils_1.screen.getAllByTestId('datetimepicker-toolbar-day')[0];
                    }
                    else {
                        toolbarButton = internal_test_utils_1.screen.getAllByTestId('toolbar-button')[0];
                    }
                    expect(toolbarButton.querySelector('[data-selected="true"]')).to.not.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(componentFamily !== 'picker' ||
        pickerParams.fieldType === 'multi-input' ||
        pickerParams.variant === 'mobile')('should close a Desktop Picker when clicking outside of the picker after selecting a value with "Enter" key', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange, onAccept, onClose, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange = (0, sinon_1.spy)();
                    onAccept = (0, sinon_1.spy)();
                    onClose = (0, sinon_1.spy)();
                    user = renderWithProps({
                        enableAccessibleFieldDOMStructure: true,
                        onChange: onChange,
                        onAccept: onAccept,
                        onClose: onClose,
                        closeOnSelect: false,
                    }, { componentFamily: componentFamily }).user;
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, pickerParams)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.keyboard('{Enter}')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user.click(document.body)];
                case 3:
                    _a.sent();
                    expect(onChange.callCount).to.equal(1);
                    expect(onClose.callCount).to.equal(1);
                    expect(onAccept.callCount).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(internal_test_utils_1.screen.queryByRole(viewWrapperRole)).to.equal(null); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.testPickerOpenCloseLifeCycle = testPickerOpenCloseLifeCycle;
