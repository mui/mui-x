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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataGridProps = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var system_1 = require("@mui/system");
var constants_1 = require("../constants");
var defaultGridSlotsComponents_1 = require("../constants/defaultGridSlotsComponents");
var utils_1 = require("../internals/utils");
var dataGridPropsDefaultValues_1 = require("../constants/dataGridPropsDefaultValues");
var DATA_GRID_FORCED_PROPS = {
    disableMultipleColumnsFiltering: true,
    disableMultipleColumnsSorting: true,
    throttleRowsMs: undefined,
    hideFooterRowCount: false,
    pagination: true,
    checkboxSelectionVisibleOnly: false,
    disableColumnReorder: true,
    keepColumnPositionIfDraggedOutside: false,
    signature: 'DataGrid',
    listView: false,
};
var getDataGridForcedProps = function (themedProps) { return (__assign(__assign({}, DATA_GRID_FORCED_PROPS), (themedProps.dataSource
    ? {
        filterMode: 'server',
        sortingMode: 'server',
        paginationMode: 'server',
    }
    : {}))); };
var defaultSlots = defaultGridSlotsComponents_1.DATA_GRID_DEFAULT_SLOTS_COMPONENTS;
var useDataGridProps = function (inProps) {
    var theme = (0, styles_1.useTheme)();
    var themedProps = React.useMemo(function () { return (0, system_1.getThemeProps)({ props: inProps, theme: theme, name: 'MuiDataGrid' }); }, [theme, inProps]);
    var localeText = React.useMemo(function () { return (__assign(__assign({}, constants_1.GRID_DEFAULT_LOCALE_TEXT), themedProps.localeText)); }, [themedProps.localeText]);
    var slots = React.useMemo(function () {
        return (0, utils_1.computeSlots)({
            defaultSlots: defaultSlots,
            slots: themedProps.slots,
        });
    }, [themedProps.slots]);
    var injectDefaultProps = React.useMemo(function () {
        return Object.keys(dataGridPropsDefaultValues_1.DATA_GRID_PROPS_DEFAULT_VALUES).reduce(function (acc, key) {
            var _a;
            // @ts-ignore
            acc[key] = (_a = themedProps[key]) !== null && _a !== void 0 ? _a : dataGridPropsDefaultValues_1.DATA_GRID_PROPS_DEFAULT_VALUES[key];
            return acc;
        }, {});
    }, [themedProps]);
    return React.useMemo(function () { return (__assign(__assign(__assign(__assign({}, themedProps), injectDefaultProps), { localeText: localeText, slots: slots }), getDataGridForcedProps(themedProps))); }, [themedProps, localeText, slots, injectDefaultProps]);
};
exports.useDataGridProps = useDataGridProps;
