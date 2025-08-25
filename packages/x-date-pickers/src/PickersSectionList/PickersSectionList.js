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
exports.PickersSectionList = exports.PickersSectionListSectionContent = exports.PickersSectionListSectionSeparator = exports.PickersSectionListSection = exports.PickersSectionListRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useForkRef_1 = require("@mui/utils/useForkRef");
var styles_1 = require("@mui/material/styles");
var pickersSectionListClasses_1 = require("./pickersSectionListClasses");
var usePickerPrivateContext_1 = require("../internals/hooks/usePickerPrivateContext");
exports.PickersSectionListRoot = (0, styles_1.styled)('div', {
    name: 'MuiPickersSectionList',
    slot: 'Root',
})({
    direction: 'ltr /*! @noflip */',
    outline: 'none',
});
exports.PickersSectionListSection = (0, styles_1.styled)('span', {
    name: 'MuiPickersSectionList',
    slot: 'Section',
})({});
exports.PickersSectionListSectionSeparator = (0, styles_1.styled)('span', {
    name: 'MuiPickersSectionList',
    slot: 'SectionSeparator',
})({
    whiteSpace: 'pre',
});
exports.PickersSectionListSectionContent = (0, styles_1.styled)('span', {
    name: 'MuiPickersSectionList',
    slot: 'SectionContent',
})({
    outline: 'none',
});
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        section: ['section'],
        sectionContent: ['sectionContent'],
    };
    return (0, composeClasses_1.default)(slots, pickersSectionListClasses_1.getPickersSectionListUtilityClass, classes);
};
function PickersSection(props) {
    var _a, _b, _c;
    var slots = props.slots, slotProps = props.slotProps, element = props.element, classes = props.classes;
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var Section = (_a = slots === null || slots === void 0 ? void 0 : slots.section) !== null && _a !== void 0 ? _a : exports.PickersSectionListSection;
    var sectionProps = (0, useSlotProps_1.default)({
        elementType: Section,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.section,
        externalForwardedProps: element.container,
        className: classes.section,
        ownerState: ownerState,
    });
    var SectionContent = (_b = slots === null || slots === void 0 ? void 0 : slots.sectionContent) !== null && _b !== void 0 ? _b : exports.PickersSectionListSectionContent;
    var sectionContentProps = (0, useSlotProps_1.default)({
        elementType: SectionContent,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.sectionContent,
        externalForwardedProps: element.content,
        additionalProps: {
            suppressContentEditableWarning: true,
        },
        className: classes.sectionContent,
        ownerState: ownerState,
    });
    var SectionSeparator = (_c = slots === null || slots === void 0 ? void 0 : slots.sectionSeparator) !== null && _c !== void 0 ? _c : exports.PickersSectionListSectionSeparator;
    var sectionSeparatorBeforeProps = (0, useSlotProps_1.default)({
        elementType: SectionSeparator,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.sectionSeparator,
        externalForwardedProps: element.before,
        ownerState: __assign(__assign({}, ownerState), { separatorPosition: 'before' }),
    });
    var sectionSeparatorAfterProps = (0, useSlotProps_1.default)({
        elementType: SectionSeparator,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.sectionSeparator,
        externalForwardedProps: element.after,
        ownerState: __assign(__assign({}, ownerState), { separatorPosition: 'after' }),
    });
    return (<Section {...sectionProps}>
      <SectionSeparator {...sectionSeparatorBeforeProps}/>
      <SectionContent {...sectionContentProps}/>
      <SectionSeparator {...sectionSeparatorAfterProps}/>
    </Section>);
}
PickersSection.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object.isRequired,
    element: prop_types_1.default.shape({
        after: prop_types_1.default.object.isRequired,
        before: prop_types_1.default.object.isRequired,
        container: prop_types_1.default.object.isRequired,
        content: prop_types_1.default.object.isRequired,
    }).isRequired,
    /**
     * The props used for each component slot.
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     */
    slots: prop_types_1.default.object,
};
/**
 * Demos:
 *
 * - [Custom field](https://mui.com/x/react-date-pickers/custom-field/)
 *
 * API:
 *
 * - [PickersSectionList API](https://mui.com/x/api/date-pickers/pickers-section-list/)
 */
var PickersSectionList = React.forwardRef(function PickersSectionList(inProps, ref) {
    var _a;
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiPickersSectionList',
    });
    var slots = props.slots, slotProps = props.slotProps, elements = props.elements, sectionListRef = props.sectionListRef, classesProp = props.classes, other = __rest(props, ["slots", "slotProps", "elements", "sectionListRef", "classes"]);
    var classes = useUtilityClasses(classesProp);
    var ownerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var rootRef = React.useRef(null);
    var handleRootRef = (0, useForkRef_1.default)(ref, rootRef);
    var getRoot = function (methodName) {
        if (!rootRef.current) {
            throw new Error("MUI X: Cannot call sectionListRef.".concat(methodName, " before the mount of the component."));
        }
        return rootRef.current;
    };
    React.useImperativeHandle(sectionListRef, function () { return ({
        getRoot: function () {
            return getRoot('getRoot');
        },
        getSectionContainer: function (index) {
            var root = getRoot('getSectionContainer');
            return root.querySelector(".".concat(pickersSectionListClasses_1.pickersSectionListClasses.section, "[data-sectionindex=\"").concat(index, "\"]"));
        },
        getSectionContent: function (index) {
            var root = getRoot('getSectionContent');
            return root.querySelector(".".concat(pickersSectionListClasses_1.pickersSectionListClasses.section, "[data-sectionindex=\"").concat(index, "\"] .").concat(pickersSectionListClasses_1.pickersSectionListClasses.sectionContent));
        },
        getSectionIndexFromDOMElement: function (element) {
            var root = getRoot('getSectionIndexFromDOMElement');
            if (element == null || !root.contains(element)) {
                return null;
            }
            var sectionContainer = null;
            if (element.classList.contains(pickersSectionListClasses_1.pickersSectionListClasses.section)) {
                sectionContainer = element;
            }
            else if (element.classList.contains(pickersSectionListClasses_1.pickersSectionListClasses.sectionContent)) {
                sectionContainer = element.parentElement;
            }
            if (sectionContainer == null) {
                return null;
            }
            return Number(sectionContainer.dataset.sectionindex);
        },
    }); });
    var Root = (_a = slots === null || slots === void 0 ? void 0 : slots.root) !== null && _a !== void 0 ? _a : exports.PickersSectionListRoot;
    var rootProps = (0, useSlotProps_1.default)({
        elementType: Root,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.root,
        externalForwardedProps: other,
        additionalProps: {
            ref: handleRootRef,
            suppressContentEditableWarning: true,
        },
        className: classes.root,
        ownerState: ownerState,
    });
    return (<Root {...rootProps}>
      {rootProps.contentEditable ? (elements
            .map(function (_a) {
            var content = _a.content, before = _a.before, after = _a.after;
            return "".concat(before.children).concat(content.children).concat(after.children);
        })
            .join('')) : (<React.Fragment>
          {elements.map(function (element, elementIndex) { return (<PickersSection key={elementIndex} slots={slots} slotProps={slotProps} element={element} classes={classes}/>); })}
        </React.Fragment>)}
    </Root>);
});
exports.PickersSectionList = PickersSectionList;
PickersSectionList.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * If true, the whole element is editable.
     * Useful when all the sections are selected.
     */
    contentEditable: prop_types_1.default.bool.isRequired,
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
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     */
    slots: prop_types_1.default.object,
};
