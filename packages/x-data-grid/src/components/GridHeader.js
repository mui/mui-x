"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeader = GridHeader;
var React = require("react");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridPreferencesPanel_1 = require("./panel/GridPreferencesPanel");
function GridHeader() {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return (<React.Fragment>
      <GridPreferencesPanel_1.GridPreferencesPanel />
      {rootProps.showToolbar && (<rootProps.slots.toolbar 
        // Fixes error augmentation issue https://github.com/mui/mui-x/pull/15255#issuecomment-2454721612
        {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.toolbar}/>)}
    </React.Fragment>);
}
