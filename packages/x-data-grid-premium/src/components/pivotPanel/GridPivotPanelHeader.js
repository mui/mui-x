"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanelHeader = GridPivotPanelHeader;
var React = require("react");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var sidebar_1 = require("../sidebar");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
var GridPivotPanelSearch_1 = require("./GridPivotPanelSearch");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['pivotPanelHeader'],
        switch: ['pivotPanelSwitch'],
        label: ['pivotPanelSwitchLabel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridPivotPanelHeaderRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelHeader',
})({
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(1),
    padding: internals_1.vars.spacing(0, 0.75, 0, 1),
    boxSizing: 'border-box',
    height: 52,
});
var GridPivotPanelSwitch = (0, system_1.styled)((internals_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSwitch',
})({
    marginRight: 'auto',
});
var GridPivotPanelSwitchLabel = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSwitchLabel',
})({
    fontWeight: internals_1.vars.typography.fontWeight.medium,
});
function GridPivotPanelHeader(props) {
    var _a, _b;
    var searchValue = props.searchValue, onSearchValueChange = props.onSearchValueChange;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var pivotActive = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotActiveSelector);
    var classes = useUtilityClasses(rootProps);
    var rows = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridRowCountSelector);
    var isEmptyPivot = pivotActive && rows === 0;
    return (<sidebar_1.SidebarHeader>
      <GridPivotPanelHeaderRoot ownerState={rootProps} className={classes.root}>
        <GridPivotPanelSwitch as={rootProps.slots.baseSwitch} ownerState={rootProps} className={classes.switch} checked={pivotActive} onChange={function (event) {
            return apiRef.current.setPivotActive(event.target.checked);
        }} size="small" label={<GridPivotPanelSwitchLabel ownerState={rootProps} className={classes.label}>
              {apiRef.current.getLocaleText('pivotToggleLabel')}
            </GridPivotPanelSwitchLabel>} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseSwitch}/>
        <rootProps.slots.baseIconButton onClick={function () {
            apiRef.current.hideSidebar();
            if (isEmptyPivot) {
                apiRef.current.setPivotActive(false);
            }
        }} aria-label={apiRef.current.getLocaleText('pivotCloseButton')} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton}>
          <rootProps.slots.sidebarCloseIcon fontSize="small"/>
        </rootProps.slots.baseIconButton>
      </GridPivotPanelHeaderRoot>
      <GridPivotPanelSearch_1.GridPivotPanelSearch value={searchValue} onClear={function () { return onSearchValueChange(''); }} onChange={function (event) {
            return onSearchValueChange(event.target.value);
        }}/>
    </sidebar_1.SidebarHeader>);
}
