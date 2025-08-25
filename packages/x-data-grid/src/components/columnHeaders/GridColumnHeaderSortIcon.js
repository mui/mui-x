"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnHeaderSortIcon = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var GridIconButtonContainer_1 = require("./GridIconButtonContainer");
var GridColumnSortButton_1 = require("../GridColumnSortButton");
function GridColumnHeaderSortIconRaw(props) {
    return (<GridIconButtonContainer_1.GridIconButtonContainer>
      <GridColumnSortButton_1.GridColumnSortButton {...props} tabIndex={-1}/>
    </GridIconButtonContainer_1.GridIconButtonContainer>);
}
var GridColumnHeaderSortIcon = React.memo(GridColumnHeaderSortIconRaw);
exports.GridColumnHeaderSortIcon = GridColumnHeaderSortIcon;
GridColumnHeaderSortIconRaw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    color: prop_types_1.default.oneOf(['default', 'inherit', 'primary']),
    direction: prop_types_1.default.oneOf(['asc', 'desc']),
    disabled: prop_types_1.default.bool,
    edge: prop_types_1.default.oneOf(['end', 'start', false]),
    field: prop_types_1.default.string.isRequired,
    id: prop_types_1.default.string,
    index: prop_types_1.default.number,
    label: prop_types_1.default.string,
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    sortingOrder: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['asc', 'desc'])).isRequired,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};
