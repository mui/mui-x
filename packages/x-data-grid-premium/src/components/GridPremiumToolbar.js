"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPremiumToolbar = GridPremiumToolbar;
var React = require("react");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var export_1 = require("./export");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var PivotPanelTrigger_1 = require("./pivotPanel/PivotPanelTrigger");
var utils_1 = require("../hooks/features/pivoting/utils");
var aiAssistantPanel_1 = require("./aiAssistantPanel");
function GridPremiumToolbar(props) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var excelOptions = props.excelOptions, other = __rest(props, ["excelOptions"]);
    var additionalItems = (<React.Fragment>
      {(0, utils_1.isPivotingAvailable)(rootProps) && (<PivotPanelTrigger_1.PivotPanelTrigger render={function (triggerProps, state) { return (<rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarPivot')}>
              <x_data_grid_pro_1.ToolbarButton {...triggerProps} color={state.active ? 'primary' : 'default'}>
                <rootProps.slots.pivotIcon fontSize="small"/>
              </x_data_grid_pro_1.ToolbarButton>
            </rootProps.slots.baseTooltip>); }}/>)}
      {rootProps.aiAssistant && (<aiAssistantPanel_1.AiAssistantPanelTrigger render={function (triggerProps) { return (<rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarAssistant')}>
              <x_data_grid_pro_1.ToolbarButton {...triggerProps} color="default">
                <rootProps.slots.aiAssistantIcon fontSize="small"/>
              </x_data_grid_pro_1.ToolbarButton>
            </rootProps.slots.baseTooltip>); }}/>)}
    </React.Fragment>);
    var additionalExportMenuItems = !((_a = props.excelOptions) === null || _a === void 0 ? void 0 : _a.disableToolbarButton)
        ? function (onMenuItemClick) {
            var _a;
            return (<export_1.ExportExcel render={<rootProps.slots.baseMenuItem {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem}/>} options={props.excelOptions} onClick={onMenuItemClick}>
          {apiRef.current.getLocaleText('toolbarExportExcel')}
        </export_1.ExportExcel>);
        }
        : undefined;
    return (<internals_1.GridToolbar {...other} additionalItems={additionalItems} additionalExportMenuItems={additionalExportMenuItems}/>);
}
