'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes, open } = ownerState;
    const slots = {
        root: ['menuIcon', open && 'menuOpen'],
        button: ['menuIconButton'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
export const ColumnHeaderMenuIcon = React.memo((props) => {
    const { colDef, open, columnMenuId, columnMenuButtonId, iconButtonRef } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { ...props, classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const handleMenuIconClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        apiRef.current.toggleColumnMenu(colDef.field);
    }, [apiRef, colDef.field]);
    const columnName = colDef.headerName ?? colDef.field;
    return (_jsx("div", { className: classes.root, children: _jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('columnMenuLabel'), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, children: _jsx(rootProps.slots.baseIconButton, { ref: iconButtonRef, tabIndex: -1, className: classes.button, "aria-label": apiRef.current.getLocaleText('columnMenuAriaLabel')(columnName), size: "small", onClick: handleMenuIconClick, "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? columnMenuId : undefined, id: columnMenuButtonId, ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.columnMenuIcon, { fontSize: "inherit" }) }) }) }));
});
