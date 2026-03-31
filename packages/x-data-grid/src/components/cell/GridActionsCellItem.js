'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const GridActionsCellItem = forwardRef((props, ref) => {
    const rootProps = useGridRootProps();
    if (!props.showInMenu) {
        const { label, icon, showInMenu, onClick, ...other } = props;
        const handleClick = (event) => {
            onClick?.(event);
        };
        return (_jsx(rootProps.slots.baseIconButton, { size: "small", role: "menuitem", "aria-label": label, ...other, onClick: handleClick, ...rootProps.slotProps?.baseIconButton, ref: ref, children: React.cloneElement(icon, { fontSize: 'small' }) }));
    }
    const { label, icon, showInMenu, onClick, closeMenuOnClick = true, closeMenu, ...other } = props;
    const handleClick = (event) => {
        onClick?.(event);
        if (closeMenuOnClick) {
            closeMenu?.();
        }
    };
    return (_jsx(rootProps.slots.baseMenuItem, { ref: ref, ...other, onClick: handleClick, iconStart: icon, children: label }));
});
export { GridActionsCellItem };
