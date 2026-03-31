import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuManageItem } from './GridColumnMenuManageItem';
function GridColumnMenuColumnsItem(props) {
    return (_jsxs(React.Fragment, { children: [_jsx(GridColumnMenuHideItem, { ...props }), _jsx(GridColumnMenuManageItem, { ...props })] }));
}
GridColumnMenuColumnsItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuColumnsItem };
