'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import HTMLElementType from '@mui/utils/HTMLElementType';
import { styled } from '@mui/material/styles';
import { isHideMenuKey } from '../../utils/keyboardUtils';
import { vars } from '../../constants/cssVariables';
import { useCSSVariablesClass } from '../../utils/css/context';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { NotRendered } from '../../utils/assert';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['menu'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridMenuRoot = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'Menu',
})({
    zIndex: vars.zIndex.menu,
    [`& .${gridClasses.menuList}`]: {
        outline: 0,
    },
});
function GridMenu(props) {
    const { open, target, onClose, children, position, className, onExited, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const variablesClass = useCSSVariablesClass();
    const savedFocusRef = React.useRef(null);
    useEnhancedEffect(() => {
        if (open) {
            savedFocusRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
        else {
            savedFocusRef.current?.focus?.();
            savedFocusRef.current = null;
        }
    }, [open]);
    React.useEffect(() => {
        // Emit menuOpen or menuClose events
        const eventName = open ? 'menuOpen' : 'menuClose';
        apiRef.current.publishEvent(eventName, { target });
    }, [apiRef, open, target]);
    const handleClickAway = (event) => {
        if (event.target && (target === event.target || target?.contains(event.target))) {
            return;
        }
        onClose(event);
    };
    const handleKeyDown = (event) => {
        if (isHideMenuKey(event.key)) {
            onClose(event);
        }
    };
    return (_jsx(GridMenuRoot, { as: rootProps.slots.basePopper, className: clsx(classes.root, className, variablesClass), ownerState: rootProps, open: open, target: target, transition: true, placement: position, onClickAway: handleClickAway, onExited: onExited, clickAwayMouseEvent: "onMouseDown", onKeyDown: handleKeyDown, ...other, ...rootProps.slotProps?.basePopper, children: children }));
}
GridMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: PropTypes.node,
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onExited: PropTypes.func,
    open: PropTypes.bool.isRequired,
    position: PropTypes.oneOf([
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
    ]),
    target: HTMLElementType,
};
export { GridMenu };
