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
exports.GridGenericColumnHeaderItem = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useForkRef_1 = require("@mui/utils/useForkRef");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var GridColumnHeaderTitle_1 = require("./GridColumnHeaderTitle");
var GridColumnHeaderSeparator_1 = require("./GridColumnHeaderSeparator");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridGenericColumnHeaderItem = (0, forwardRef_1.forwardRef)(function GridGenericColumnHeaderItem(props, ref) {
    var classes = props.classes, columnMenuOpen = props.columnMenuOpen, colIndex = props.colIndex, height = props.height, isResizing = props.isResizing, sortDirection = props.sortDirection, hasFocus = props.hasFocus, tabIndex = props.tabIndex, separatorSide = props.separatorSide, isDraggable = props.isDraggable, headerComponent = props.headerComponent, description = props.description, elementId = props.elementId, width = props.width, _a = props.columnMenuIconButton, columnMenuIconButton = _a === void 0 ? null : _a, _b = props.columnMenu, columnMenu = _b === void 0 ? null : _b, _c = props.columnTitleIconButtons, columnTitleIconButtons = _c === void 0 ? null : _c, headerClassName = props.headerClassName, label = props.label, resizable = props.resizable, draggableContainerProps = props.draggableContainerProps, columnHeaderSeparatorProps = props.columnHeaderSeparatorProps, style = props.style, other = __rest(props, ["classes", "columnMenuOpen", "colIndex", "height", "isResizing", "sortDirection", "hasFocus", "tabIndex", "separatorSide", "isDraggable", "headerComponent", "description", "elementId", "width", "columnMenuIconButton", "columnMenu", "columnTitleIconButtons", "headerClassName", "label", "resizable", "draggableContainerProps", "columnHeaderSeparatorProps", "style"]);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var headerCellRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(headerCellRef, ref);
    var ariaSort = 'none';
    if (sortDirection != null) {
        ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    React.useLayoutEffect(function () {
        var _a;
        var columnMenuState = apiRef.current.state.columnMenu;
        if (hasFocus && !columnMenuState.open) {
            var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
            var elementToFocus = focusableElement || headerCellRef.current;
            elementToFocus === null || elementToFocus === void 0 ? void 0 : elementToFocus.focus();
            if ((_a = apiRef.current.columnHeadersContainerRef) === null || _a === void 0 ? void 0 : _a.current) {
                apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
            }
        }
    }, [apiRef, hasFocus]);
    return (<div className={(0, clsx_1.default)(classes.root, headerClassName)} style={__assign(__assign({}, style), { width: width })} role="columnheader" tabIndex={tabIndex} aria-colindex={colIndex + 1} aria-sort={ariaSort} {...other} ref={handleRef}>
        <div className={classes.draggableContainer} draggable={isDraggable} role="presentation" {...draggableContainerProps}>
          <div className={classes.titleContainer} role="presentation">
            <div className={classes.titleContainerContent}>
              {headerComponent !== undefined ? (headerComponent) : (<GridColumnHeaderTitle_1.GridColumnHeaderTitle label={label} description={description} columnWidth={width}/>)}
            </div>
            {columnTitleIconButtons}
          </div>
          {columnMenuIconButton}
        </div>
        <GridColumnHeaderSeparator_1.GridColumnHeaderSeparator resizable={!rootProps.disableColumnResize && !!resizable} resizing={isResizing} height={height} side={separatorSide} {...columnHeaderSeparatorProps}/>
        {columnMenu}
      </div>);
});
exports.GridGenericColumnHeaderItem = GridGenericColumnHeaderItem;
