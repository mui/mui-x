"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnsPanel = GridColumnsPanel;
var React = require("react");
var GridPanelWrapper_1 = require("./GridPanelWrapper");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridColumnsPanel(props) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return (<GridPanelWrapper_1.GridPanelWrapper {...props}>
      <rootProps.slots.columnsManagement {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.columnsManagement}/>
    </GridPanelWrapper_1.GridPanelWrapper>);
}
