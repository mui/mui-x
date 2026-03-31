'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { CollapsibleContext } from './CollapsibleContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['collapsible'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const CollapsibleRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'Collapsible',
})(({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: ownerState.open ? '1 0 auto' : '0 0 auto',
    borderRadius: vars.radius.base,
}));
function Collapsible(props) {
    const { className, children, initiallyOpen = true, ...other } = props;
    const [open, setOpen] = React.useState(initiallyOpen);
    const panelId = useId();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes, open };
    const classes = useUtilityClasses(ownerState);
    const contextValue = React.useMemo(() => ({ open, onOpenChange: setOpen, panelId }), [open, setOpen, panelId]);
    return (_jsx(CollapsibleContext.Provider, { value: contextValue, children: _jsx(CollapsibleRoot, { ownerState: ownerState, className: clsx(classes.root, className), ...other, children: children }) }));
}
export { Collapsible };
