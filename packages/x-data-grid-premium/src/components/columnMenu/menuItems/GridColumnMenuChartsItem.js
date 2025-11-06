"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuChartsItem = GridColumnMenuChartsItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var gridChartsIntegrationSelectors_1 = require("../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
function GridColumnMenuChartsItem(props) {
    var _a;
    var onClick = props.onClick;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var isChartsPanelOpen = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsPanelOpenSelector);
    var openChartsSettings = function (event) {
        onClick(event);
        apiRef.current.setChartsPanelOpen(true);
    };
    if (!((_a = rootProps.experimentalFeatures) === null || _a === void 0 ? void 0 : _a.charts) || !rootProps.chartsIntegration) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, { onClick: openChartsSettings, iconStart: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsIcon, { fontSize: "small" }), disabled: isChartsPanelOpen, children: apiRef.current.getLocaleText('columnMenuManageCharts') }));
}
