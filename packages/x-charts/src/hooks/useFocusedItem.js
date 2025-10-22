"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFocusedItem = useFocusedItem;
var React = require("react");
var useStore_1 = require("../internals/store/useStore");
var useSelector_1 = require("../internals/store/useSelector");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
/**
 * Get the focused item from keyboard navigation.
 */
function useFocusedItem() {
    var store = (0, useStore_1.useStore)();
    var focusedSeriesType = (0, useSelector_1.useSelector)(store, useChartKeyboardNavigation_1.selectorChartsFocusedSeriesType);
    var focusedSeriesId = (0, useSelector_1.useSelector)(store, useChartKeyboardNavigation_1.selectorChartsFocusedSeriesId);
    var focusedDataIndex = (0, useSelector_1.useSelector)(store, useChartKeyboardNavigation_1.selectorChartsFocusedDataIndex);
    return React.useMemo(function () {
        return focusedSeriesType === undefined ||
            focusedSeriesId === undefined ||
            focusedDataIndex === undefined
            ? null
            : {
                seriesType: focusedSeriesType,
                seriesId: focusedSeriesId,
                dataIndex: focusedDataIndex,
            };
    }, [focusedSeriesType, focusedSeriesId, focusedDataIndex]);
}
