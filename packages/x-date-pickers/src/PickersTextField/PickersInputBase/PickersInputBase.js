"use strict";
'use client';
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
exports.PickersInputBase = exports.PickersInputBaseSectionsContainer = exports.PickersInputBaseRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var FormControl_1 = require("@mui/material/FormControl");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var refType_1 = require("@mui/utils/refType");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var visuallyHidden_1 = require("@mui/utils/visuallyHidden");
var pickersInputBaseClasses_1 = require("./pickersInputBaseClasses");
var PickersSectionList_1 = require("../../PickersSectionList");
var usePickerTextFieldOwnerState_1 = require("../usePickerTextFieldOwnerState");
var round = function (value) { return Math.round(value * 1e5) / 1e5; };
exports.PickersInputBaseRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersInputBase',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, theme.typography.body1), { color: (theme.vars || theme).palette.text.primary, cursor: 'text', padding: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', boxSizing: 'border-box', letterSpacing: "".concat(round(0.15 / 16), "em"), variants: [
            {
                props: { isInputInFullWidth: true },
                style: { width: '100%' },
            },
        ] }));
});
exports.PickersInputBaseSectionsContainer = (0, styles_1.styled)(PickersSectionList_1.Unstable_PickersSectionListRoot, {
    name: 'MuiPickersInputBase',
    slot: 'SectionsContainer',
})(function (_a) {
    var theme = _a.theme;
    return ({
        padding: '4px 0 5px',
        fontFamily: theme.typography.fontFamily,
        fontSize: 'inherit',
        lineHeight: '1.4375em', // 23px
        flexGrow: 1,
        outline: 'none',
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        letterSpacing: 'inherit',
        // Baseline behavior
        width: '182px',
        variants: [
            {
                props: { fieldDirection: 'rtl' },
                style: {
                    justifyContent: 'end',
                },
            },
            {
                props: { inputSize: 'small' },
                style: {
                    paddingTop: 1,
                },
            },
            {
                props: { hasStartAdornment: false, isFieldFocused: false, isFieldValueEmpty: true },
                style: {
                    color: 'currentColor',
                    opacity: 0,
                },
            },
            {
                props: {
                    hasStartAdornment: false,
                    isFieldFocused: false,
                    isFieldValueEmpty: true,
                    inputHasLabel: false,
                },
                style: theme.vars
                    ? {
                        opacity: theme.vars.opacity.inputPlaceholder,
                    }
                    : {
                        opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
                    },
            },
        ],
    });
});
var PickersInputBaseSection = (0, styles_1.styled)(PickersSectionList_1.Unstable_PickersSectionListSection, {
    name: 'MuiPickersInputBase',
    slot: 'Section',
})(function (_a) {
    var theme = _a.theme;
    return ({
        fontFamily: theme.typography.fontFamily,
        fontSize: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: '1.4375em', // 23px
        display: 'inline-block',
        whiteSpace: 'nowrap',
    });
});
var PickersInputBaseSectionContent = (0, styles_1.styled)(PickersSectionList_1.Unstable_PickersSectionListSectionContent, {
    name: 'MuiPickersInputBase',
    slot: 'SectionContent',
    overridesResolver: function (props, styles) { return styles.content; }, // FIXME: Inconsistent naming with slot
})(function (_a) {
    var theme = _a.theme;
    return ({
        fontFamily: theme.typography.fontFamily,
        lineHeight: '1.4375em', // 23px
        letterSpacing: 'inherit',
        width: 'fit-content',
        outline: 'none',
    });
});
var PickersInputBaseSectionSeparator = (0, styles_1.styled)(PickersSectionList_1.Unstable_PickersSectionListSectionSeparator, {
    name: 'MuiPickersInputBase',
    slot: 'Separator',
})(function () { return ({
    whiteSpace: 'pre',
    letterSpacing: 'inherit',
}); });
var PickersInputBaseInput = (0, styles_1.styled)('input', {
    name: 'MuiPickersInputBase',
    slot: 'Input',
    overridesResolver: function (props, styles) { return styles.hiddenInput; }, // FIXME: Inconsistent naming with slot
})(__assign({}, visuallyHidden_1.default));
var PickersInputBaseActiveBar = (0, styles_1.styled)('div', {
    name: 'MuiPickersInputBase',
    slot: 'ActiveBar',
})(function (_a) {
    var theme = _a.theme, ownerState = _a.ownerState;
    return ({
        display: 'none',
        position: 'absolute',
        height: 2,
        bottom: 2,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        transition: theme.transitions.create(['width', 'left'], {
            duration: theme.transitions.duration.shortest,
        }),
        backgroundColor: (theme.vars || theme).palette.primary.main,
        '[data-active-range-position="start"] &, [data-active-range-position="end"] &': {
            display: 'block',
        },
        '[data-active-range-position="start"] &': {
            left: ownerState.sectionOffsets[0],
        },
        '[data-active-range-position="end"] &': {
            left: ownerState.sectionOffsets[1],
        },
    });
});
var useUtilityClasses = function (classes, ownerState) {
    var isFieldFocused = ownerState.isFieldFocused, isFieldDisabled = ownerState.isFieldDisabled, isFieldReadOnly = ownerState.isFieldReadOnly, hasFieldError = ownerState.hasFieldError, inputSize = ownerState.inputSize, isInputInFullWidth = ownerState.isInputInFullWidth, inputColor = ownerState.inputColor, hasStartAdornment = ownerState.hasStartAdornment, hasEndAdornment = ownerState.hasEndAdornment;
    var slots = {
        root: [
            'root',
            isFieldFocused && !isFieldDisabled && 'focused',
            isFieldDisabled && 'disabled',
            isFieldReadOnly && 'readOnly',
            hasFieldError && 'error',
            isInputInFullWidth && 'fullWidth',
            "color".concat((0, capitalize_1.default)(inputColor)),
            inputSize === 'small' && 'inputSizeSmall',
            hasStartAdornment && 'adornedStart',
            hasEndAdornment && 'adornedEnd',
        ],
        notchedOutline: ['notchedOutline'],
        input: ['input'],
        sectionsContainer: ['sectionsContainer'],
        sectionContent: ['sectionContent'],
        sectionBefore: ['sectionBefore'],
        sectionAfter: ['sectionAfter'],
        activeBar: ['activeBar'],
    };
    return (0, composeClasses_1.default)(slots, pickersInputBaseClasses_1.getPickersInputBaseUtilityClass, classes);
};
function resolveSectionElementWidth(sectionElement, rootRef, index, dateRangePosition) {
    var _a;
    if (sectionElement.content.id) {
        var activeSectionElements = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[data-sectionindex=\"".concat(index, "\"] [data-range-position=\"").concat(dateRangePosition, "\"]"));
        if (activeSectionElements) {
            return Array.from(activeSectionElements).reduce(function (currentActiveBarWidth, element) {
                return currentActiveBarWidth + element.offsetWidth;
            }, 0);
        }
    }
    return 0;
}
function resolveSectionWidthAndOffsets(elements, rootRef) {
    var _a, _b, _c, _d, _e;
    var activeBarWidth = 0;
    var activeRangePosition = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.getAttribute('data-active-range-position');
    if (activeRangePosition === 'end') {
        for (var i = elements.length - 1; i >= elements.length / 2; i -= 1) {
            activeBarWidth += resolveSectionElementWidth(elements[i], rootRef, i, 'end');
        }
    }
    else {
        for (var i = 0; i < elements.length / 2; i += 1) {
            activeBarWidth += resolveSectionElementWidth(elements[i], rootRef, i, 'start');
        }
    }
    return {
        activeBarWidth: activeBarWidth,
        sectionOffsets: [
            ((_c = (_b = rootRef.current) === null || _b === void 0 ? void 0 : _b.querySelector("[data-sectionindex=\"0\"]")) === null || _c === void 0 ? void 0 : _c.offsetLeft) || 0,
            ((_e = (_d = rootRef.current) === null || _d === void 0 ? void 0 : _d.querySelector("[data-sectionindex=\"".concat(elements.length / 2, "\"]"))) === null || _e === void 0 ? void 0 : _e.offsetLeft) || 0,
        ],
    };
}
/**
 * @ignore - internal component.
 */
var PickersInputBase = React.forwardRef(function PickersInputBase(inProps, ref) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersInputBase',
    });
    var elements = props.elements, areAllSectionsEmpty = props.areAllSectionsEmpty, defaultValue = props.defaultValue, label = props.label, value = props.value, onChange = props.onChange, id = props.id, autoFocus = props.autoFocus, endAdornment = props.endAdornment, startAdornment = props.startAdornment, renderSuffix = props.renderSuffix, slots = props.slots, slotProps = props.slotProps, contentEditable = props.contentEditable, tabIndex = props.tabIndex, onInput = props.onInput, onPaste = props.onPaste, onKeyDown = props.onKeyDown, fullWidth = props.fullWidth, name = props.name, readOnly = props.readOnly, inputProps = props.inputProps, inputRef = props.inputRef, sectionListRef = props.sectionListRef, onFocus = props.onFocus, onBlur = props.onBlur, classesProp = props.classes, ownerStateProp = props.ownerState, other = __rest(props, ["elements", "areAllSectionsEmpty", "defaultValue", "label", "value", "onChange", "id", "autoFocus", "endAdornment", "startAdornment", "renderSuffix", "slots", "slotProps", "contentEditable", "tabIndex", "onInput", "onPaste", "onKeyDown", "fullWidth", "name", "readOnly", "inputProps", "inputRef", "sectionListRef", "onFocus", "onBlur", "classes", "ownerState"]);
    var ownerStateContext = (0, usePickerTextFieldOwnerState_1.usePickerTextFieldOwnerState)();
    var rootRef = React.useRef(null);
    var activeBarRef = React.useRef(null);
    var sectionOffsetsRef = React.useRef([]);
    var handleRootRef = (0, useForkRef_1.default)(ref, rootRef);
    var handleInputRef = (0, useForkRef_1.default)(inputProps === null || inputProps === void 0 ? void 0 : inputProps.ref, inputRef);
    var muiFormControl = (0, FormControl_1.useFormControl)();
    if (!muiFormControl) {
        throw new Error('MUI X: PickersInputBase should always be used inside a PickersTextField component');
    }
    var ownerState = ownerStateProp !== null && ownerStateProp !== void 0 ? ownerStateProp : ownerStateContext;
    var handleInputFocus = function (event) {
        var _a;
        (_a = muiFormControl.onFocus) === null || _a === void 0 ? void 0 : _a.call(muiFormControl, event);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
    };
    var handleHiddenInputFocus = function (event) {
        handleInputFocus(event);
    };
    var handleKeyDown = function (event) {
        var _a, _b;
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        if (event.key === 'Enter' && !event.defaultMuiPrevented) {
            // Do nothing if it's a multi input field
            if ((_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.dataset.multiInput) {
                return;
            }
            var closestForm = (_b = rootRef.current) === null || _b === void 0 ? void 0 : _b.closest('form');
            var submitTrigger = closestForm === null || closestForm === void 0 ? void 0 : closestForm.querySelector('[type="submit"]');
            if (!closestForm || !submitTrigger) {
                // do nothing if there is no form or no submit button (trigger)
                return;
            }
            event.preventDefault();
            // native input trigger submit with the `submitter` field set
            closestForm.requestSubmit(submitTrigger);
        }
    };
    var handleInputBlur = function (event) {
        var _a;
        (_a = muiFormControl.onBlur) === null || _a === void 0 ? void 0 : _a.call(muiFormControl, event);
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(event);
    };
    React.useEffect(function () {
        if (muiFormControl) {
            muiFormControl.setAdornedStart(Boolean(startAdornment));
        }
    }, [muiFormControl, startAdornment]);
    React.useEffect(function () {
        if (!muiFormControl) {
            return;
        }
        if (areAllSectionsEmpty) {
            muiFormControl.onEmpty();
        }
        else {
            muiFormControl.onFilled();
        }
    }, [muiFormControl, areAllSectionsEmpty]);
    var classes = useUtilityClasses(classesProp, ownerState);
    var InputRoot = (slots === null || slots === void 0 ? void 0 : slots.root) || exports.PickersInputBaseRoot;
    var inputRootProps = (0, useSlotProps_1.default)({
        elementType: InputRoot,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.root,
        externalForwardedProps: other,
        additionalProps: {
            'aria-invalid': muiFormControl.error,
            ref: handleRootRef,
        },
        className: classes.root,
        ownerState: ownerState,
    });
    var InputSectionsContainer = (slots === null || slots === void 0 ? void 0 : slots.input) || exports.PickersInputBaseSectionsContainer;
    var isSingleInputRange = elements.some(function (element) { return element.content['data-range-position'] !== undefined; });
    React.useEffect(function () {
        if (!isSingleInputRange || !ownerState.isPickerOpen) {
            return;
        }
        var _a = resolveSectionWidthAndOffsets(elements, rootRef), activeBarWidth = _a.activeBarWidth, sectionOffsets = _a.sectionOffsets;
        sectionOffsetsRef.current = [sectionOffsets[0], sectionOffsets[1]];
        if (activeBarRef.current) {
            activeBarRef.current.style.width = "".concat(activeBarWidth, "px");
        }
    }, [elements, isSingleInputRange, ownerState.isPickerOpen]);
    return (<InputRoot {...inputRootProps}>
      {startAdornment}
      <PickersSectionList_1.Unstable_PickersSectionList sectionListRef={sectionListRef} elements={elements} contentEditable={contentEditable} tabIndex={tabIndex} className={classes.sectionsContainer} onFocus={handleInputFocus} onBlur={handleInputBlur} onInput={onInput} onPaste={onPaste} onKeyDown={handleKeyDown} slots={{
            root: InputSectionsContainer,
            section: PickersInputBaseSection,
            sectionContent: PickersInputBaseSectionContent,
            sectionSeparator: PickersInputBaseSectionSeparator,
        }} slotProps={{
            root: __assign(__assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.input), { ownerState: ownerState }),
            sectionContent: { className: pickersInputBaseClasses_1.pickersInputBaseClasses.sectionContent },
            sectionSeparator: function (_a) {
                var separatorPosition = _a.separatorPosition;
                return ({
                    className: separatorPosition === 'before'
                        ? pickersInputBaseClasses_1.pickersInputBaseClasses.sectionBefore
                        : pickersInputBaseClasses_1.pickersInputBaseClasses.sectionAfter,
                });
            },
        }}/>
      {endAdornment}
      {renderSuffix
            ? renderSuffix(__assign({}, muiFormControl))
            : null}
      <PickersInputBaseInput name={name} className={classes.input} value={value} onChange={onChange} id={id} aria-hidden="true" tabIndex={-1} readOnly={readOnly} required={muiFormControl.required} disabled={muiFormControl.disabled} 
    // Hidden input element cannot be focused, trigger the root focus instead
    // This allows to maintain the ability to do `inputRef.current.focus()` to focus the field
    onFocus={handleHiddenInputFocus} {...inputProps} ref={handleInputRef}/>
      {isSingleInputRange && (<PickersInputBaseActiveBar className={classes.activeBar} ref={activeBarRef} ownerState={{ sectionOffsets: sectionOffsetsRef.current }}/>)}
    </InputRoot>);
});
exports.PickersInputBase = PickersInputBase;
PickersInputBase.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Is `true` if the current values equals the empty value.
     * For a single item value, it means that `value === null`
     * For a range value, it means that `value === [null, null]`
     */
    areAllSectionsEmpty: prop_types_1.default.bool.isRequired,
    className: prop_types_1.default.string,
    component: prop_types_1.default.elementType,
    /**
     * If true, the whole element is editable.
     * Useful when all the sections are selected.
     */
    contentEditable: prop_types_1.default.bool.isRequired,
    'data-multi-input': prop_types_1.default.string,
    /**
     * The elements to render.
     * Each element contains the prop to edit a section of the value.
     */
    elements: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        after: prop_types_1.default.object.isRequired,
        before: prop_types_1.default.object.isRequired,
        container: prop_types_1.default.object.isRequired,
        content: prop_types_1.default.object.isRequired,
    })).isRequired,
    endAdornment: prop_types_1.default.node,
    fullWidth: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    inputProps: prop_types_1.default.object,
    inputRef: refType_1.default,
    label: prop_types_1.default.node,
    margin: prop_types_1.default.oneOf(['dense', 'none', 'normal']),
    name: prop_types_1.default.string,
    onChange: prop_types_1.default.func.isRequired,
    onClick: prop_types_1.default.func.isRequired,
    onInput: prop_types_1.default.func.isRequired,
    onKeyDown: prop_types_1.default.func.isRequired,
    onPaste: prop_types_1.default.func.isRequired,
    ownerState: prop_types_1.default /* @typescript-to-proptypes-ignore */.any,
    readOnly: prop_types_1.default.bool,
    renderSuffix: prop_types_1.default.func,
    sectionListRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                getRoot: prop_types_1.default.func.isRequired,
                getSectionContainer: prop_types_1.default.func.isRequired,
                getSectionContent: prop_types_1.default.func.isRequired,
                getSectionIndexFromDOMElement: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * The components used for each slot inside.
     *
     * @default {}
     */
    slots: prop_types_1.default.object,
    startAdornment: prop_types_1.default.node,
    style: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    value: prop_types_1.default.string.isRequired,
};
