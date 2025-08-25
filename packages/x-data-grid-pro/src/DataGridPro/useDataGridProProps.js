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
exports.useDataGridProProps = exports.DATA_GRID_PRO_PROPS_DEFAULT_VALUES = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var system_1 = require("@mui/system");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var dataGridProDefaultSlotsComponents_1 = require("../constants/dataGridProDefaultSlotsComponents");
var getDataGridProForcedProps = function (themedProps) { return (__assign({ signature: 'DataGridPro' }, (themedProps.dataSource
    ? {
        filterMode: 'server',
        sortingMode: 'server',
        paginationMode: 'server',
    }
    : {}))); };
/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
exports.DATA_GRID_PRO_PROPS_DEFAULT_VALUES = __assign(__assign({}, x_data_grid_1.DATA_GRID_PROPS_DEFAULT_VALUES), { autosizeOnMount: false, defaultGroupingExpansionDepth: 0, disableAutosize: false, disableChildrenFiltering: false, disableChildrenSorting: false, disableColumnPinning: false, getDetailPanelHeight: function () { return 500; }, headerFilters: false, keepColumnPositionIfDraggedOutside: false, rowSelectionPropagation: internals_1.ROW_SELECTION_PROPAGATION_DEFAULT, rowReordering: false, rowsLoadingMode: 'client', scrollEndThreshold: 80, treeData: false, lazyLoading: false, lazyLoadingRequestThrottleMs: 500, listView: false, multipleColumnsSortingMode: 'withModifierKey' });
var defaultSlots = dataGridProDefaultSlotsComponents_1.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;
var useDataGridProProps = function (inProps) {
    var theme = (0, styles_1.useTheme)();
    var themedProps = React.useMemo(function () { return (0, system_1.getThemeProps)({ props: inProps, theme: theme, name: 'MuiDataGrid' }); }, [theme, inProps]);
    var localeText = React.useMemo(function () { return (__assign(__assign({}, x_data_grid_1.GRID_DEFAULT_LOCALE_TEXT), themedProps.localeText)); }, [themedProps.localeText]);
    var slots = React.useMemo(function () {
        return (0, internals_1.computeSlots)({
            defaultSlots: defaultSlots,
            slots: themedProps.slots,
        });
    }, [themedProps.slots]);
    return React.useMemo(function () { return (__assign(__assign(__assign(__assign({}, exports.DATA_GRID_PRO_PROPS_DEFAULT_VALUES), themedProps), { localeText: localeText, slots: slots }), getDataGridProForcedProps(themedProps))); }, [themedProps, localeText, slots]);
};
exports.useDataGridProProps = useDataGridProProps;
