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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnPinningPreProcessors = void 0;
var React = require("react");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridColumnPinningPreProcessors = function (apiRef, props) {
    var disableColumnPinning = props.disableColumnPinning;
    var prevAllPinnedColumns = React.useRef([]);
    var reorderPinnedColumns = React.useCallback(function (columnsState) {
        if (columnsState.orderedFields.length === 0 || disableColumnPinning) {
            return columnsState;
        }
        // HACK: This is a hack needed because the pipe processors aren't pure enough. What
        // they should be is `gridState -> gridState` transformers, but they only transform a slice
        // of the state, not the full state. So if they need access to other parts of the state (like
        // the `state.columns.orderedFields` in this case), they might lag behind because the selectors
        // are selecting the old state in `apiRef`, not the state being computed in the current pipe processor.
        var savedState = apiRef.current.state;
        apiRef.current.state = __assign(__assign({}, savedState), { columns: columnsState });
        var pinnedColumns = (0, internals_1.gridExistingPinnedColumnSelector)(apiRef);
        apiRef.current.state = savedState;
        // HACK: Ends here //
        var leftPinnedColumns = pinnedColumns.left;
        var rightPinnedColumns = pinnedColumns.right;
        var newOrderedFields;
        var allPinnedColumns = __spreadArray(__spreadArray([], leftPinnedColumns, true), rightPinnedColumns, true);
        var orderedFieldsBeforePinningColumns = apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns;
        if (orderedFieldsBeforePinningColumns) {
            newOrderedFields = new Array(columnsState.orderedFields.length).fill(null);
            var newOrderedFieldsBeforePinningColumns_1 = __spreadArray([], newOrderedFields, true);
            // Contains the fields not added to the orderedFields array yet
            var remainingFields_1 = __spreadArray([], columnsState.orderedFields, true);
            // First, we check if the column was unpinned since the last processing.
            // If yes and it still exists, we move it back to the same position it was before pinning
            prevAllPinnedColumns.current.forEach(function (field) {
                if (!allPinnedColumns.includes(field) && columnsState.lookup[field]) {
                    // Get the position before pinning
                    var index = orderedFieldsBeforePinningColumns.indexOf(field);
                    newOrderedFields[index] = field;
                    newOrderedFieldsBeforePinningColumns_1[index] = field;
                    // This field was already consumed so we prevent from being added again
                    remainingFields_1.splice(remainingFields_1.indexOf(field), 1);
                }
            });
            // For columns still pinned, we keep stored their original positions
            allPinnedColumns.forEach(function (field) {
                var index = orderedFieldsBeforePinningColumns.indexOf(field);
                // If index = -1, the pinned field didn't exist in the last processing, it's possibly being added now
                // If index >= newOrderedFieldsBeforePinningColumns.length, then one or more columns were removed
                // In both cases, use the position from the columns array
                // TODO: detect removed columns and decrease the positions after it
                if (index === -1 || index >= newOrderedFieldsBeforePinningColumns_1.length) {
                    index = columnsState.orderedFields.indexOf(field);
                }
                // The fallback above may make the column to be inserted in a position already occupied
                // In this case, put it in any empty slot available
                if (newOrderedFieldsBeforePinningColumns_1[index] !== null) {
                    index = 0;
                    while (newOrderedFieldsBeforePinningColumns_1[index] !== null) {
                        index += 1;
                    }
                }
                newOrderedFields[index] = field;
                newOrderedFieldsBeforePinningColumns_1[index] = field;
                // This field was already consumed so we prevent from being added again
                remainingFields_1.splice(remainingFields_1.indexOf(field), 1);
            });
            // The fields remaining are those that're neither pinnned nor were unpinned
            // For these, we spread them across both arrays making sure to not override existing values
            var i_1 = 0;
            remainingFields_1.forEach(function (field) {
                while (newOrderedFieldsBeforePinningColumns_1[i_1] !== null) {
                    i_1 += 1;
                }
                newOrderedFieldsBeforePinningColumns_1[i_1] = field;
                newOrderedFields[i_1] = field;
            });
            apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns =
                newOrderedFieldsBeforePinningColumns_1;
        }
        else {
            newOrderedFields = __spreadArray([], columnsState.orderedFields, true);
            apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns = __spreadArray([], columnsState.orderedFields, true);
        }
        prevAllPinnedColumns.current = allPinnedColumns;
        var centerColumns = newOrderedFields.filter(function (field) {
            return !leftPinnedColumns.includes(field) && !rightPinnedColumns.includes(field);
        });
        return __assign(__assign({}, columnsState), { orderedFields: __spreadArray(__spreadArray(__spreadArray([], leftPinnedColumns, true), centerColumns, true), rightPinnedColumns, true) });
    }, [apiRef, disableColumnPinning]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', reorderPinnedColumns);
    var isColumnPinned = React.useCallback(function (initialValue, field) { return apiRef.current.isColumnPinned(field); }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'isColumnPinned', isColumnPinned);
};
exports.useGridColumnPinningPreProcessors = useGridColumnPinningPreProcessors;
