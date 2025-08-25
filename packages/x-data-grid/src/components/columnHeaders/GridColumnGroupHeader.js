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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnGroupHeader = GridColumnGroupHeader;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var composeClasses_1 = require("@mui/utils/composeClasses");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridColumnGroupsSelector_1 = require("../../hooks/features/columnGrouping/gridColumnGroupsSelector");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var GridGenericColumnHeaderItem_1 = require("./GridGenericColumnHeaderItem");
var domUtils_1 = require("../../utils/domUtils");
var constants_1 = require("../../internals/constants");
var utils_1 = require("../../internals/utils");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, headerAlign = ownerState.headerAlign, isDragging = ownerState.isDragging, isLastColumn = ownerState.isLastColumn, showLeftBorder = ownerState.showLeftBorder, showRightBorder = ownerState.showRightBorder, groupId = ownerState.groupId, pinnedPosition = ownerState.pinnedPosition;
    var slots = {
        root: [
            'columnHeader',
            headerAlign === 'left' && 'columnHeader--alignLeft',
            headerAlign === 'center' && 'columnHeader--alignCenter',
            headerAlign === 'right' && 'columnHeader--alignRight',
            isDragging && 'columnHeader--moving',
            showRightBorder && 'columnHeader--withRightBorder',
            showLeftBorder && 'columnHeader--withLeftBorder',
            'withBorderColor',
            groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup',
            pinnedPosition === constants_1.PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
            pinnedPosition === constants_1.PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
            isLastColumn && 'columnHeader--last',
        ],
        draggableContainer: ['columnHeaderDraggableContainer'],
        titleContainer: ['columnHeaderTitleContainer', 'withBorderColor'],
        titleContainerContent: ['columnHeaderTitleContainerContent'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridColumnGroupHeader(props) {
    var _a;
    var groupId = props.groupId, width = props.width, depth = props.depth, maxDepth = props.maxDepth, fields = props.fields, height = props.height, colIndex = props.colIndex, hasFocus = props.hasFocus, tabIndex = props.tabIndex, isLastColumn = props.isLastColumn, pinnedPosition = props.pinnedPosition, pinnedOffset = props.pinnedOffset;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var headerCellRef = React.useRef(null);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columnGroupsLookup = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsLookupSelector);
    var group = groupId ? columnGroupsLookup[groupId] : {};
    var _b = group.headerName, headerName = _b === void 0 ? groupId !== null && groupId !== void 0 ? groupId : '' : _b, _c = group.description, description = _c === void 0 ? '' : _c, _d = group.headerAlign, headerAlign = _d === void 0 ? undefined : _d;
    var headerComponent;
    var render = groupId && ((_a = columnGroupsLookup[groupId]) === null || _a === void 0 ? void 0 : _a.renderHeaderGroup);
    var renderParams = React.useMemo(function () { return ({
        groupId: groupId,
        headerName: headerName,
        description: description,
        depth: depth,
        maxDepth: maxDepth,
        fields: fields,
        colIndex: colIndex,
        isLastColumn: isLastColumn,
    }); }, [groupId, headerName, description, depth, maxDepth, fields, colIndex, isLastColumn]);
    if (groupId && render) {
        headerComponent = render(renderParams);
    }
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes, headerAlign: headerAlign, depth: depth, isDragging: false });
    var label = headerName !== null && headerName !== void 0 ? headerName : groupId;
    var id = (0, useId_1.default)();
    var elementId = groupId === null ? "empty-group-cell-".concat(id) : groupId;
    var classes = useUtilityClasses(ownerState);
    React.useLayoutEffect(function () {
        if (hasFocus) {
            var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
            var elementToFocus = focusableElement || headerCellRef.current;
            elementToFocus === null || elementToFocus === void 0 ? void 0 : elementToFocus.focus();
        }
    }, [apiRef, hasFocus]);
    var publish = React.useCallback(function (eventName) { return function (event) {
        // Ignore portal
        // See https://github.com/mui/mui-x/issues/1721
        if ((0, domUtils_1.isEventTargetInPortal)(event)) {
            return;
        }
        apiRef.current.publishEvent(eventName, renderParams, event);
    }; }, 
    // For now this is stupid, because renderParams change all the time.
    // Need to move it's computation in the api, such that for a given depth+columnField, I can get the group parameters
    [apiRef, renderParams]);
    var mouseEventsHandlers = React.useMemo(function () { return ({
        onKeyDown: publish('columnGroupHeaderKeyDown'),
        onFocus: publish('columnGroupHeaderFocus'),
        onBlur: publish('columnGroupHeaderBlur'),
    }); }, [publish]);
    var headerClassName = typeof group.headerClassName === 'function'
        ? group.headerClassName(renderParams)
        : group.headerClassName;
    var style = React.useMemo(function () { return (0, utils_1.attachPinnedStyle)(__assign({}, props.style), isRtl, pinnedPosition, pinnedOffset); }, [pinnedPosition, pinnedOffset, props.style, isRtl]);
    return (<GridGenericColumnHeaderItem_1.GridGenericColumnHeaderItem ref={headerCellRef} classes={classes} columnMenuOpen={false} colIndex={colIndex} height={height} isResizing={false} sortDirection={null} hasFocus={false} tabIndex={tabIndex} isDraggable={false} headerComponent={headerComponent} headerClassName={headerClassName} description={description} elementId={elementId} width={width} columnMenuIconButton={null} columnTitleIconButtons={null} resizable={false} label={label} aria-colspan={fields.length} 
    // The fields are wrapped between |-...-| to avoid confusion between fields "id" and "id2" when using selector data-fields~=
    data-fields={"|-".concat(fields.join('-|-'), "-|")} style={style} {...mouseEventsHandlers}/>);
}
