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
exports.useDataGridPremiumProps = exports.DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var aggregation_1 = require("../hooks/features/aggregation");
var dataGridPremiumDefaultSlotsComponents_1 = require("../constants/dataGridPremiumDefaultSlotsComponents");
var utils_1 = require("../hooks/features/pivoting/utils");
var gridAggregationUtils_1 = require("../hooks/features/aggregation/gridAggregationUtils");
var getDataGridPremiumForcedProps = function (themedProps) { return (__assign({ signature: x_data_grid_pro_1.GridSignature.DataGridPremium }, (themedProps.dataSource
    ? {
        filterMode: 'server',
        sortingMode: 'server',
        paginationMode: 'server',
    }
    : {}))); };
/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
exports.DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES = __assign(__assign({}, x_data_grid_pro_1.DATA_GRID_PRO_PROPS_DEFAULT_VALUES), { cellSelection: false, disableAggregation: false, disableRowGrouping: false, rowGroupingColumnMode: 'single', aggregationFunctions: aggregation_1.GRID_AGGREGATION_FUNCTIONS, aggregationRowsScope: 'filtered', getAggregationPosition: gridAggregationUtils_1.defaultGetAggregationPosition, disableClipboardPaste: false, splitClipboardPastedText: function (pastedText, delimiter) {
        if (delimiter === void 0) { delimiter = '\t'; }
        // Excel on Windows adds an empty line break at the end of the copied text.
        // See https://github.com/mui/mui-x/issues/9103
        var text = pastedText.replace(/\r?\n$/, '');
        return text.split(/\r\n|\n|\r/).map(function (row) { return row.split(delimiter); });
    }, disablePivoting: false, getPivotDerivedColumns: utils_1.defaultGetPivotDerivedColumns, aiAssistant: false });
var defaultSlots = dataGridPremiumDefaultSlotsComponents_1.DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS;
var useDataGridPremiumProps = function (inProps) {
    var theme = (0, styles_1.useTheme)();
    var themedProps = React.useMemo(function () { return (0, system_1.getThemeProps)({ props: inProps, theme: theme, name: 'MuiDataGrid' }); }, [theme, inProps]);
    var localeText = React.useMemo(function () { return (__assign(__assign({}, x_data_grid_pro_1.GRID_DEFAULT_LOCALE_TEXT), themedProps.localeText)); }, [themedProps.localeText]);
    var slots = React.useMemo(function () {
        return (0, internals_1.computeSlots)({
            defaultSlots: defaultSlots,
            slots: themedProps.slots,
        });
    }, [themedProps.slots]);
    return React.useMemo(function () { return (__assign(__assign(__assign(__assign(__assign({}, exports.DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES), (themedProps.dataSource ? { aggregationFunctions: {} } : {})), themedProps), { localeText: localeText, slots: slots }), getDataGridPremiumForcedProps(themedProps))); }, [themedProps, localeText, slots]);
};
exports.useDataGridPremiumProps = useDataGridPremiumProps;
