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
exports.TreeItem = exports.TreeItemCheckbox = exports.TreeItemLoadingContainer = exports.TreeItemErrorContainer = exports.TreeItemGroupTransition = exports.TreeItemIconContainer = exports.TreeItemLabel = exports.TreeItemContent = exports.TreeItemRoot = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var CircularProgress_1 = require("@mui/material/CircularProgress");
var unsupportedProp_1 = require("@mui/utils/unsupportedProp");
var styles_1 = require("@mui/material/styles");
var Collapse_1 = require("@mui/material/Collapse");
var Checkbox_1 = require("@mui/material/Checkbox");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var createStyled_1 = require("@mui/system/createStyled");
var composeClasses_1 = require("@mui/utils/composeClasses");
var zero_styled_1 = require("../internals/zero-styled");
var useTreeItem_1 = require("../useTreeItem");
var treeItemClasses_1 = require("./treeItemClasses");
var TreeItemIcon_1 = require("../TreeItemIcon");
var TreeItemDragAndDropOverlay_1 = require("../TreeItemDragAndDropOverlay");
var TreeItemProvider_1 = require("../TreeItemProvider");
var TreeItemLabelInput_1 = require("../TreeItemLabelInput");
var TreeViewStyleContext_1 = require("../internals/TreeViewProvider/TreeViewStyleContext");
var useThemeProps = (0, zero_styled_1.createUseThemeProps)('MuiTreeItem');
exports.TreeItemRoot = (0, zero_styled_1.styled)('li', {
    name: 'MuiTreeItem',
    slot: 'Root',
})({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    outline: 0,
});
exports.TreeItemContent = (0, zero_styled_1.styled)('div', {
    name: 'MuiTreeItem',
    slot: 'Content',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'status'; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        padding: theme.spacing(0.5, 1),
        paddingLeft: "calc(".concat(theme.spacing(1), " + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))"),
        borderRadius: theme.shape.borderRadius,
        width: '100%',
        boxSizing: 'border-box', // prevent width + padding to overflow
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        '&:hover': {
            backgroundColor: (theme.vars || theme).palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&[data-disabled]': {
            opacity: (theme.vars || theme).palette.action.disabledOpacity,
            backgroundColor: 'transparent',
        },
        '&[data-focused]': {
            backgroundColor: (theme.vars || theme).palette.action.focus,
        },
        '&[data-selected]': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity),
            '&:hover': {
                backgroundColor: theme.vars
                    ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / calc(").concat(theme.vars.palette.action.selectedOpacity, " + ").concat(theme.vars.palette.action.hoverOpacity, "))")
                    : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: theme.vars
                        ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")")
                        : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity),
                },
            },
        },
        '&[data-selected][data-focused]': {
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / calc(").concat(theme.vars.palette.action.selectedOpacity, " + ").concat(theme.vars.palette.action.focusOpacity, "))")
                : (0, styles_1.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity),
        },
    });
});
exports.TreeItemLabel = (0, zero_styled_1.styled)('div', {
    name: 'MuiTreeItem',
    slot: 'Label',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'editable'; },
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ width: '100%', boxSizing: 'border-box', 
        // fixes overflow - see https://github.com/mui/material-ui/issues/27372
        minWidth: 0, position: 'relative', overflow: 'hidden' }, theme.typography.body1), { variants: [
            {
                props: function (_a) {
                    var editable = _a.editable;
                    return editable;
                },
                style: {
                    paddingLeft: '2px',
                },
            },
        ] }));
});
exports.TreeItemIconContainer = (0, zero_styled_1.styled)('div', {
    name: 'MuiTreeItem',
    slot: 'IconContainer',
})({
    width: 16,
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    position: 'relative',
    '& svg': {
        fontSize: 18,
    },
});
exports.TreeItemGroupTransition = (0, zero_styled_1.styled)(Collapse_1.default, {
    name: 'MuiTreeItem',
    slot: 'GroupTransition',
    overridesResolver: function (props, styles) { return styles.groupTransition; },
})({
    margin: 0,
    padding: 0,
});
exports.TreeItemErrorContainer = (0, zero_styled_1.styled)('div', {
    name: 'MuiTreeItem',
    slot: 'ErrorIcon',
})({
    position: 'absolute',
    right: -3,
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: 'red',
});
exports.TreeItemLoadingContainer = (0, zero_styled_1.styled)(CircularProgress_1.default, {
    name: 'MuiTreeItem',
    slot: 'LoadingIcon',
})({
    color: 'text.primary',
});
exports.TreeItemCheckbox = (0, zero_styled_1.styled)(React.forwardRef(function (props, ref) {
    var visible = props.visible, other = __rest(props, ["visible"]);
    if (!visible) {
        return null;
    }
    return <Checkbox_1.default {...other} ref={ref}/>;
}), {
    name: 'MuiTreeItem',
    slot: 'Checkbox',
})({
    padding: 0,
});
var useUtilityClasses = function (classesProp) {
    var classesFromTreeView = (0, TreeViewStyleContext_1.useTreeViewStyleContext)().classes;
    var classes = __assign(__assign({}, classesProp), { root: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.root, classesFromTreeView.root), content: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.content, classesFromTreeView.itemContent), iconContainer: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.iconContainer, classesFromTreeView.itemIconContainer), checkbox: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.checkbox, classesFromTreeView.itemCheckbox), label: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.label, classesFromTreeView.itemLabel), groupTransition: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.groupTransition, classesFromTreeView.itemGroupTransition), labelInput: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.labelInput, classesFromTreeView.itemLabelInput), dragAndDropOverlay: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.dragAndDropOverlay, classesFromTreeView.itemDragAndDropOverlay), errorIcon: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.errorIcon, classesFromTreeView.itemErrorIcon), loadingIcon: (0, clsx_1.default)(classesProp === null || classesProp === void 0 ? void 0 : classesProp.loadingIcon, classesFromTreeView.itemLoadingIcon) });
    var slots = {
        root: ['root'],
        content: ['content'],
        iconContainer: ['iconContainer'],
        checkbox: ['checkbox'],
        label: ['label'],
        groupTransition: ['groupTransition'],
        labelInput: ['labelInput'],
        dragAndDropOverlay: ['dragAndDropOverlay'],
        errorIcon: ['errorIcon'],
        loadingIcon: ['loadingIcon'],
        expanded: ['expanded'],
        editing: ['editing'],
        editable: ['editable'],
        selected: ['selected'],
        focused: ['focused'],
        disabled: ['disabled'],
    };
    return (0, composeClasses_1.default)(slots, treeItemClasses_1.getTreeItemUtilityClass, classes);
};
/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItem API](https://mui.com/x/api/tree-view/tree-item-2/)
 */
exports.TreeItem = React.forwardRef(function TreeItem(inProps, forwardedRef) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var props = useThemeProps({ props: inProps, name: 'MuiTreeItem' });
    var id = props.id, itemId = props.itemId, label = props.label, disabled = props.disabled, children = props.children, _m = props.slots, slots = _m === void 0 ? {} : _m, _o = props.slotProps, slotProps = _o === void 0 ? {} : _o, classesProp = props.classes, other = __rest(props, ["id", "itemId", "label", "disabled", "children", "slots", "slotProps", "classes"]);
    var _p = (0, useTreeItem_1.useTreeItem)({
        id: id,
        itemId: itemId,
        children: children,
        label: label,
        disabled: disabled,
    }), getContextProviderProps = _p.getContextProviderProps, getRootProps = _p.getRootProps, getContentProps = _p.getContentProps, getIconContainerProps = _p.getIconContainerProps, getCheckboxProps = _p.getCheckboxProps, getLabelProps = _p.getLabelProps, getGroupTransitionProps = _p.getGroupTransitionProps, getLabelInputProps = _p.getLabelInputProps, getDragAndDropOverlayProps = _p.getDragAndDropOverlayProps, getErrorContainerProps = _p.getErrorContainerProps, getLoadingContainerProps = _p.getLoadingContainerProps, status = _p.status;
    var classes = useUtilityClasses(classesProp);
    var Root = (_b = slots.root) !== null && _b !== void 0 ? _b : exports.TreeItemRoot;
    var rootProps = (0, useSlotProps_1.default)({
        elementType: Root,
        getSlotProps: getRootProps,
        externalForwardedProps: other,
        externalSlotProps: slotProps.root,
        additionalProps: {
            ref: forwardedRef,
        },
        ownerState: {},
        className: classes.root,
    });
    var Content = (_c = slots.content) !== null && _c !== void 0 ? _c : exports.TreeItemContent;
    var contentProps = (0, useSlotProps_1.default)({
        elementType: Content,
        getSlotProps: getContentProps,
        externalSlotProps: slotProps.content,
        ownerState: {},
        className: (0, clsx_1.default)(classes.content, (_a = {},
            _a[classes.expanded] = status.expanded,
            _a[classes.selected] = status.selected,
            _a[classes.focused] = status.focused,
            _a[classes.disabled] = status.disabled,
            _a[classes.editing] = status.editing,
            _a[classes.editable] = status.editable,
            _a)),
    });
    var IconContainer = (_d = slots.iconContainer) !== null && _d !== void 0 ? _d : exports.TreeItemIconContainer;
    var iconContainerProps = (0, useSlotProps_1.default)({
        elementType: IconContainer,
        getSlotProps: getIconContainerProps,
        externalSlotProps: slotProps.iconContainer,
        ownerState: {},
        className: classes.iconContainer,
    });
    var Label = (_e = slots.label) !== null && _e !== void 0 ? _e : exports.TreeItemLabel;
    var labelProps = (0, useSlotProps_1.default)({
        elementType: Label,
        getSlotProps: getLabelProps,
        externalSlotProps: slotProps.label,
        ownerState: {},
        className: classes.label,
    });
    var Checkbox = (_f = slots.checkbox) !== null && _f !== void 0 ? _f : exports.TreeItemCheckbox;
    var checkboxProps = (0, useSlotProps_1.default)({
        elementType: Checkbox,
        getSlotProps: getCheckboxProps,
        externalSlotProps: slotProps.checkbox,
        ownerState: {},
        className: classes.checkbox,
    });
    var GroupTransition = (_g = slots.groupTransition) !== null && _g !== void 0 ? _g : undefined;
    var groupTransitionProps = (0, useSlotProps_1.default)({
        elementType: GroupTransition,
        getSlotProps: getGroupTransitionProps,
        externalSlotProps: slotProps.groupTransition,
        ownerState: {},
        className: classes.groupTransition,
    });
    var LabelInput = (_h = slots.labelInput) !== null && _h !== void 0 ? _h : TreeItemLabelInput_1.TreeItemLabelInput;
    var labelInputProps = (0, useSlotProps_1.default)({
        elementType: LabelInput,
        getSlotProps: getLabelInputProps,
        externalSlotProps: slotProps.labelInput,
        ownerState: {},
        className: classes.labelInput,
    });
    var DragAndDropOverlay = (_j = slots.dragAndDropOverlay) !== null && _j !== void 0 ? _j : TreeItemDragAndDropOverlay_1.TreeItemDragAndDropOverlay;
    var dragAndDropOverlayProps = (0, useSlotProps_1.default)({
        elementType: DragAndDropOverlay,
        getSlotProps: getDragAndDropOverlayProps,
        externalSlotProps: slotProps.dragAndDropOverlay,
        ownerState: {},
        className: classes.dragAndDropOverlay,
    });
    var ErrorIcon = (_k = slots.errorIcon) !== null && _k !== void 0 ? _k : exports.TreeItemErrorContainer;
    var errorContainerProps = (0, useSlotProps_1.default)({
        elementType: ErrorIcon,
        getSlotProps: getErrorContainerProps,
        externalSlotProps: slotProps.errorIcon,
        ownerState: {},
        className: classes.errorIcon,
    });
    var LoadingIcon = (_l = slots.loadingIcon) !== null && _l !== void 0 ? _l : exports.TreeItemLoadingContainer;
    var loadingContainerProps = (0, useSlotProps_1.default)({
        elementType: LoadingIcon,
        getSlotProps: getLoadingContainerProps,
        externalSlotProps: slotProps.loadingIcon,
        ownerState: {},
        className: classes.loadingIcon,
    });
    return (<TreeItemProvider_1.TreeItemProvider {...getContextProviderProps()}>
      <Root {...rootProps}>
        <Content {...contentProps}>
          <IconContainer {...iconContainerProps}>
            {status.error && <ErrorIcon {...errorContainerProps}/>}

            {status.loading ? (<LoadingIcon {...loadingContainerProps}/>) : (<TreeItemIcon_1.TreeItemIcon status={status} slots={slots} slotProps={slotProps}/>)}
          </IconContainer>
          <Checkbox {...checkboxProps}/>
          {status.editing ? <LabelInput {...labelInputProps}/> : <Label {...labelProps}/>}
          <DragAndDropOverlay {...dragAndDropOverlayProps}/>
        </Content>
        {children && <exports.TreeItemGroupTransition as={GroupTransition} {...groupTransitionProps}/>}
      </Root>
    </TreeItemProvider_1.TreeItemProvider>);
});
exports.TreeItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The content of the component.
     */
    children: prop_types_1.default /* @typescript-to-proptypes-ignore */.any,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * If `true`, the item is disabled.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * The id attribute of the item. If not provided, it will be generated.
     */
    id: prop_types_1.default.string,
    /**
     * The id of the item.
     * Must be unique.
     */
    itemId: prop_types_1.default.string.isRequired,
    /**
     * The label of the item.
     */
    label: prop_types_1.default.node,
    /**
     * Callback fired when the item root is blurred.
     */
    onBlur: prop_types_1.default.func,
    /**
     * This prop isn't supported.
     * Use the `onItemFocus` callback on the tree if you need to monitor an item's focus.
     */
    onFocus: unsupportedProp_1.default,
    /**
     * Callback fired when a key is pressed on the keyboard and the tree is in focus.
     */
    onKeyDown: prop_types_1.default.func,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
