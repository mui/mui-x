'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { isHideMenuKey } from '../../../utils/keyboardUtils';
import { NotRendered } from '../../../utils/assert';
import { gridClasses } from '../../../constants/gridClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
const StyledMenuList = styled((NotRendered), {
    slot: 'internal',
})(() => ({
    minWidth: 248,
}));
function handleMenuScrollCapture(event) {
    if (!event.currentTarget.contains(event.target)) {
        return;
    }
    event.stopPropagation();
}
const GridColumnMenuContainer = forwardRef(function GridColumnMenuContainer(props, ref) {
    const { hideMenu, colDef, id, labelledby, className, children, open, ...other } = props;
    const rootProps = useGridRootProps();
    const handleListKeyDown = React.useCallback((event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
        }
        if (isHideMenuKey(event.key)) {
            hideMenu(event);
        }
    }, [hideMenu]);
    return (_jsx(StyledMenuList, { as: rootProps.slots.baseMenuList, id: id, className: clsx(gridClasses.menuList, className), "aria-labelledby": labelledby, onKeyDown: handleListKeyDown, onWheel: handleMenuScrollCapture, onTouchMove: handleMenuScrollCapture, autoFocus: open, ...other, ref: ref, children: children }));
});
GridColumnMenuContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    hideMenu: PropTypes.func.isRequired,
    id: PropTypes.string,
    labelledby: PropTypes.string,
    open: PropTypes.bool.isRequired,
};
export { GridColumnMenuContainer };
