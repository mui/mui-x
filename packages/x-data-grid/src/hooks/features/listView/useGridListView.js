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
exports.listViewStateInitializer = void 0;
exports.useGridListView = useGridListView;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var warning_1 = require("@mui/x-internals/warning");
var dimensions_1 = require("../dimensions");
var useGridEvent_1 = require("../../utils/useGridEvent");
var listViewStateInitializer = function (state, props, apiRef) { return (__assign(__assign({}, state), { listViewColumn: props.listViewColumn
        ? __assign(__assign({}, props.listViewColumn), { computedWidth: getListColumnWidth(apiRef) }) : undefined })); };
exports.listViewStateInitializer = listViewStateInitializer;
function useGridListView(apiRef, props) {
    /*
     * EVENTS
     */
    var updateListColumnWidth = function () {
        apiRef.current.setState(function (state) {
            if (!state.listViewColumn) {
                return state;
            }
            return __assign(__assign({}, state), { listViewColumn: __assign(__assign({}, state.listViewColumn), { computedWidth: getListColumnWidth(apiRef) }) });
        });
    };
    var prevInnerWidth = React.useRef(null);
    var handleGridSizeChange = function (viewportInnerSize) {
        if (prevInnerWidth.current !== viewportInnerSize.width) {
            prevInnerWidth.current = viewportInnerSize.width;
            updateListColumnWidth();
        }
    };
    (0, useGridEvent_1.useGridEvent)(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnVisibilityModelChange', updateListColumnWidth);
    /*
     * EFFECTS
     */
    (0, useEnhancedEffect_1.default)(function () {
        var listColumn = props.listViewColumn;
        if (listColumn) {
            apiRef.current.setState(function (state) {
                return __assign(__assign({}, state), { listViewColumn: __assign(__assign({}, listColumn), { computedWidth: getListColumnWidth(apiRef) }) });
            });
        }
    }, [apiRef, props.listViewColumn]);
    React.useEffect(function () {
        if (props.listView && !props.listViewColumn) {
            (0, warning_1.warnOnce)([
                'MUI X: The `listViewColumn` prop must be set if `listView` is enabled.',
                'To fix, pass a column definition to the `listViewColumn` prop, e.g. `{ field: "example", renderCell: (params) => <div>{params.row.id}</div> }`.',
                'For more details, see https://mui.com/x/react-data-grid/list-view/',
            ]);
        }
    }, [props.listView, props.listViewColumn]);
}
function getListColumnWidth(apiRef) {
    return (0, dimensions_1.gridDimensionsSelector)(apiRef).viewportInnerSize.width;
}
