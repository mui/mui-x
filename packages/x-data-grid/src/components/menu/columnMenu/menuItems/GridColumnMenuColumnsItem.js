"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnMenuColumnsItem = GridColumnMenuColumnsItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var GridColumnMenuHideItem_1 = require("./GridColumnMenuHideItem");
var GridColumnMenuManageItem_1 = require("./GridColumnMenuManageItem");
function GridColumnMenuColumnsItem(props) {
    return (<React.Fragment>
      <GridColumnMenuHideItem_1.GridColumnMenuHideItem {...props}/>
      <GridColumnMenuManageItem_1.GridColumnMenuManageItem {...props}/>
    </React.Fragment>);
}
GridColumnMenuColumnsItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
