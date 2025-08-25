"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanelSearch = GridPivotPanelSearch;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        container: ['pivotPanelSearchContainer'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridPivotPanelSearchContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSearchContainer',
})({
    padding: internals_1.vars.spacing(0, 1, 1),
});
function GridPivotPanelSearch(props) {
    var _a;
    var onClear = props.onClear, value = props.value, onChange = props.onChange;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var classes = useUtilityClasses(rootProps);
    var handleKeyDown = function (event) {
        if (event.key === 'Escape') {
            onClear();
        }
    };
    return (<GridPivotPanelSearchContainer ownerState={rootProps} className={classes.container}>
      <rootProps.slots.baseTextField size="small" aria-label={apiRef.current.getLocaleText('pivotSearchControlLabel')} placeholder={apiRef.current.getLocaleText('pivotSearchControlPlaceholder')} onKeyDown={handleKeyDown} fullWidth slotProps={{
            input: {
                startAdornment: <rootProps.slots.pivotSearchIcon fontSize="small"/>,
                endAdornment: value ? (<rootProps.slots.baseIconButton edge="end" size="small" onClick={onClear} aria-label={apiRef.current.getLocaleText('pivotSearchControlClear')}>
                <rootProps.slots.pivotSearchClearIcon fontSize="small"/>
              </rootProps.slots.baseIconButton>) : null,
            },
        }} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField} value={value} onChange={onChange}/>
    </GridPivotPanelSearchContainer>);
}
