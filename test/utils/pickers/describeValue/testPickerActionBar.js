"use strict";
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
exports.testPickerActionBar = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
var testPickerActionBar = function (ElementToTest, options) {
    var componentFamily = options.componentFamily, render = options.render, renderWithProps = options.renderWithProps, values = options.values, emptyValue = options.emptyValue, setNewValue = options.setNewValue, pickerParams = __rest(options, ["componentFamily", "render", "renderWithProps", "values", "emptyValue", "setNewValue"]);
    if (componentFamily !== 'picker') {
        return;
    }
    var isRangeType = (0, pickers_1.isPickerRangeType)(pickerParams.type);
    describe('Picker action bar', function () {
        describe('clear action', function () {
            it('should call onClose, onChange with empty value and onAccept with empty value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={values[0]} open slotProps={{ actionBar: { actions: ['clear'] } }}/>);
                // Clear the date
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/clear/i));
                expect(onChange.callCount).to.equal(1);
                (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onChange, emptyValue);
                expect(onAccept.callCount).to.equal(1);
                (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onAccept, emptyValue);
                expect(onClose.callCount).to.equal(1);
            });
            it('should not call onChange or onAccept if the value is already empty value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} open slotProps={{ actionBar: { actions: ['clear'] } }} value={emptyValue}/>);
                // Clear the date
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/clear/i));
                expect(onChange.callCount).to.equal(0);
                expect(onAccept.callCount).to.equal(0);
                expect(onClose.callCount).to.equal(1);
            });
        });
        describe('cancel action', function () {
            it('should call onClose and onChange with the initial value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                var _a = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    onAccept: onAccept,
                    onClose: onClose,
                    open: true,
                    defaultValue: values[0],
                    slotProps: { actionBar: { actions: ['cancel', 'nextOrAccept'] } },
                    closeOnSelect: false,
                }), selectSection = _a.selectSection, pressKey = _a.pressKey;
                // Change the value (already tested)
                setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
                // Cancel the modifications
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/cancel/i));
                expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams) + 1);
                if (isRangeType) {
                    values[0].forEach(function (value, index) {
                        expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                    });
                }
                else {
                    expect(onChange.lastCall.args[0]).toEqualDateTime(values[0]);
                }
                expect(onAccept.callCount).to.equal(0);
                expect(onClose.callCount).to.equal(1);
            });
            it('should not call onChange if no prior value modification', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} open value={values[0]} slotProps={{ actionBar: { actions: ['cancel'] } }} closeOnSelect={false}/>);
                // Cancel the modifications
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/cancel/i));
                expect(onChange.callCount).to.equal(0);
                expect(onAccept.callCount).to.equal(0);
                expect(onClose.callCount).to.equal(1);
            });
        });
        describe('confirm action', function () {
            it('should call onClose and onAccept with the live value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                var _a = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: onChange,
                    onAccept: onAccept,
                    onClose: onClose,
                    open: true,
                    defaultValue: values[0],
                    slotProps: { actionBar: { actions: ['accept', 'nextOrAccept'] } },
                    closeOnSelect: false,
                }), selectSection = _a.selectSection, pressKey = _a.pressKey;
                // Change the value (already tested)
                setNewValue(values[0], { isOpened: true, selectSection: selectSection, pressKey: pressKey });
                // Accept the modifications
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getAllByRole('button', { name: 'OK' })[0]);
                expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, pickerParams)); // The accepted value as already been committed, don't call onChange again
                expect(onAccept.callCount).to.equal(1);
                expect(onClose.callCount).to.equal(1);
            });
            it('should call onChange, onClose and onAccept when validating the default value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} open defaultValue={values[0]} slotProps={{ actionBar: { actions: ['accept'] } }} closeOnSelect={false}/>);
                // Accept the modifications
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/ok/i));
                expect(onChange.callCount).to.equal(1);
                expect(onAccept.callCount).to.equal(1);
                expect(onClose.callCount).to.equal(1);
            });
            it('should call onClose but not onAccept when validating an already validated value', function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} open value={values[0]} slotProps={{ actionBar: { actions: ['accept'] } }} closeOnSelect={false}/>);
                // Accept the modifications
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/ok/i));
                expect(onChange.callCount).to.equal(0);
                expect(onAccept.callCount).to.equal(0);
                expect(onClose.callCount).to.equal(1);
            });
        });
        describe('today action', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2018, 0, 1));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it("should call onClose, onChange with today's value and onAccept with today's value", function () {
                var onChange = (0, sinon_1.spy)();
                var onAccept = (0, sinon_1.spy)();
                var onClose = (0, sinon_1.spy)();
                render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={values[0]} open slotProps={{ actionBar: { actions: ['today'] } }}/>);
                internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/today/i));
                var startOfToday;
                if (pickerParams.type === 'date') {
                    startOfToday = pickers_1.adapterToUse.startOfDay(pickers_1.adapterToUse.date());
                }
                else if (isRangeType) {
                    startOfToday = [pickers_1.adapterToUse.date(), pickers_1.adapterToUse.date()];
                }
                else {
                    startOfToday = pickers_1.adapterToUse.date();
                }
                expect(onChange.callCount).to.equal(1);
                (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onChange, startOfToday);
                expect(onAccept.callCount).to.equal(1);
                (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onAccept, startOfToday);
                expect(onClose.callCount).to.equal(1);
            });
        });
    });
};
exports.testPickerActionBar = testPickerActionBar;
