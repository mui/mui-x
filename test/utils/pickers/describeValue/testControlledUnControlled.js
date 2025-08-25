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
exports.testControlledUnControlled = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var InputBase_1 = require("@mui/material/InputBase");
var pickers_1 = require("test/utils/pickers");
var fireUserEvent_1 = require("../../fireUserEvent");
var testControlledUnControlled = function (ElementToTest, options) {
    var render = options.render, renderWithProps = options.renderWithProps, values = options.values, componentFamily = options.componentFamily, emptyValue = options.emptyValue, assertRenderedValue = options.assertRenderedValue, setNewValue = options.setNewValue, pickerParams = __rest(options, ["render", "renderWithProps", "values", "componentFamily", "emptyValue", "assertRenderedValue", "setNewValue"]);
    var params = pickerParams;
    var isRangeType = params.type === 'date-range' ||
        params.type === 'date-time-range' ||
        params.type === 'time-range';
    var isDesktopRange = params.variant === 'desktop' && isRangeType;
    describe('Controlled / uncontrolled value', function () {
        describe('Value props (value, defaultValue, onChange', function () {
            it('should render an empty value when no controlled value and no default value are defined', function () {
                renderWithProps({ enableAccessibleFieldDOMStructure: true });
                assertRenderedValue(emptyValue);
            });
            it('should use the  controlled value when defined', function () {
                renderWithProps({ enableAccessibleFieldDOMStructure: true, value: values[0] });
                assertRenderedValue(values[0]);
            });
            it('should use the default value when defined', function () {
                renderWithProps({ enableAccessibleFieldDOMStructure: true, defaultValue: values[0] });
                assertRenderedValue(values[0]);
            });
            it('should use the controlled value instead of the default value when both are defined', function () {
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    defaultValue: values[0],
                    value: values[1],
                });
                assertRenderedValue(values[1]);
            });
            it('should use the controlled value instead of the default value when both are defined and the controlled value is null', function () {
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    defaultValue: values[0],
                    value: emptyValue,
                });
                assertRenderedValue(emptyValue);
            });
            it('should render an empty value if neither the controlled value or the default value are defined', function () {
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                });
                assertRenderedValue(emptyValue);
            });
            it('should react to controlled value update (from non null to another non null)', function () {
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    value: values[0],
                });
                assertRenderedValue(values[0]);
                view.setProps({
                    value: values[1],
                });
                assertRenderedValue(values[1]);
            });
            it('should react to a controlled value update (from non null to null)', function () {
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    value: values[0],
                });
                assertRenderedValue(values[0]);
                view.setProps({
                    value: emptyValue,
                });
                assertRenderedValue(emptyValue);
            });
            it('should react to a controlled value update (from null to non null)', function () {
                var view = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    value: emptyValue,
                });
                assertRenderedValue(emptyValue);
                view.setProps({
                    value: values[0],
                });
                assertRenderedValue(values[0]);
            });
            it('should call onChange when updating a value defined with `props.defaultValue` and update the rendered value', function () {
                var onChange = (0, sinon_1.spy)();
                var v7Response = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    defaultValue: values[0],
                    onChange: onChange,
                });
                var newValue = setNewValue(values[0], {
                    selectSection: v7Response.selectSection,
                    pressKey: v7Response.pressKey,
                    closeMobilePicker: true,
                });
                assertRenderedValue(newValue);
                // // TODO: Clean this exception or change the clock behavior
                // expect(onChange.callCount).to.equal(getExpectedOnChangeCount(componentFamily, params));
                // if (Array.isArray(newValue)) {
                //   newValue.forEach((value, index) => {
                //     expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                //   });
                // } else {
                //   expect(onChange.lastCall.args[0]).toEqualDateTime(newValue as any);
                // }
            });
            it('should call onChange when updating a value defined with `props.value`', function () {
                var onChange = (0, sinon_1.spy)();
                var useControlledElement = function (props) {
                    var _a = React.useState((props === null || props === void 0 ? void 0 : props.value) || null), value = _a[0], setValue = _a[1];
                    var handleChange = React.useCallback(function (newValue) {
                        setValue(newValue);
                        props === null || props === void 0 ? void 0 : props.onChange(newValue);
                    }, [props]);
                    return { value: value, onChange: handleChange };
                };
                var v7Response = renderWithProps({ enableAccessibleFieldDOMStructure: true, value: values[0], onChange: onChange }, { hook: useControlledElement });
                var newValue = setNewValue(values[0], {
                    selectSection: v7Response.selectSection,
                    pressKey: v7Response.pressKey,
                    closeMobilePicker: true,
                });
                expect(onChange.callCount).to.equal((0, pickers_1.getExpectedOnChangeCount)(componentFamily, params));
                if (Array.isArray(newValue)) {
                    newValue.forEach(function (value, index) {
                        expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
                    });
                }
                else {
                    expect(onChange.lastCall.args[0]).toEqualDateTime(newValue);
                }
            });
        });
        describe('Form props', function () {
            it("should apply disabled=\"true\" prop", function () {
                if (!['field', 'picker'].includes(componentFamily)) {
                    return;
                }
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    value: values[0],
                    disabled: true,
                });
                (0, pickers_1.getAllFieldInputRoot)().forEach(function (fieldRoot) {
                    expect(fieldRoot).to.have.class('Mui-disabled');
                });
            });
            it("should apply readOnly=\"true\" prop", function () {
                if (!['field', 'picker'].includes(componentFamily)) {
                    return;
                }
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    value: values[0],
                    readOnly: true,
                });
                (0, pickers_1.getAllFieldInputRoot)().forEach(function (fieldInputRoot) {
                    expect(fieldInputRoot).to.have.class('Mui-readOnly');
                });
            });
        });
        describe('Accessibility and field editing', function () {
            it('should allow editing in field on single input mobile pickers', function () {
                if (componentFamily !== 'picker' || params.variant !== 'mobile') {
                    return;
                }
                var handleChange = (0, sinon_1.spy)();
                var v7Response = renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    onChange: handleChange,
                    defaultValue: values[0],
                });
                v7Response.selectSection(undefined);
                fireUserEvent_1.fireUserEvent.keyPress(v7Response.getActiveSection(0), { key: 'ArrowUp' });
                expect(handleChange.callCount).to.equal((0, pickers_1.isPickerSingleInput)(params) ? 1 : 0);
            });
            it('should have correct labelledby relationship when toolbar is shown', function () {
                if (componentFamily !== 'picker' || isDesktopRange) {
                    return;
                }
                renderWithProps({
                    enableAccessibleFieldDOMStructure: true,
                    open: true,
                    slotProps: { toolbar: { hidden: false } },
                    localeText: { toolbarTitle: 'Test toolbar' },
                });
                if (params.variant === 'mobile' && params.type === 'date-time-range') {
                    expect(internal_test_utils_1.screen.getByLabelText('Start End')).to.have.attribute('role', 'dialog');
                }
                else {
                    expect(internal_test_utils_1.screen.getByLabelText('Test toolbar')).to.have.attribute('role', 'dialog');
                }
            });
            it('should have correct labelledby relationship with provided label when toolbar is hidden', function () {
                if (componentFamily !== 'picker' || isDesktopRange) {
                    return;
                }
                renderWithProps(__assign({ enableAccessibleFieldDOMStructure: true, open: true, slotProps: { toolbar: { hidden: true } } }, ((0, pickers_1.isPickerSingleInput)(params)
                    ? { label: 'test relationship' }
                    : {
                        localeText: {
                            start: 'test',
                            end: 'relationship',
                        },
                    })));
                expect(internal_test_utils_1.screen.getByRole('dialog', { name: 'test relationship' })).not.to.equal(null);
            });
            it('should have correct labelledby relationship without label and hidden toolbar but external props', function () {
                var _a;
                if (componentFamily !== 'picker' || isDesktopRange) {
                    return;
                }
                render(<div>
            <div id="label-id">external label</div>
            <ElementToTest open {...(isRangeType && {
                    localeText: {
                        start: '',
                        end: '',
                    },
                })} slotProps={_a = {
                            toolbar: { hidden: true }
                        },
                        _a[params.variant === 'desktop' ? 'popper' : 'mobilePaper'] = {
                            'aria-labelledby': 'label-id',
                        },
                        _a}/>
          </div>);
                expect(internal_test_utils_1.screen.getByLabelText('external label')).to.have.attribute('role', 'dialog');
            });
            describe('slots: textField', function () {
                it('should respect provided `error="true"` prop', function () {
                    if (!['field', 'picker'].includes(componentFamily)) {
                        return;
                    }
                    renderWithProps({
                        enableAccessibleFieldDOMStructure: true,
                        slotProps: { textField: { error: true } },
                    });
                    var fieldRoot = (0, pickers_1.getFieldInputRoot)();
                    expect(fieldRoot).to.have.class(InputBase_1.inputBaseClasses.error);
                    expect(fieldRoot).to.have.attribute('aria-invalid', 'true');
                    if (isRangeType && params.fieldType === 'multi-input') {
                        var fieldRootEnd = (0, pickers_1.getFieldInputRoot)(1);
                        expect(fieldRootEnd).to.have.class(InputBase_1.inputBaseClasses.error);
                        expect(fieldRootEnd).to.have.attribute('aria-invalid', 'true');
                    }
                });
            });
        });
    });
};
exports.testControlledUnControlled = testControlledUnControlled;
