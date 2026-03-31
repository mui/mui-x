import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useCollapsibleContext } from './CollapsibleContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['collapsibleTrigger'],
        icon: ['collapsibleIcon'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const CollapsibleTriggerRoot = styled('button', {
    name: 'MuiDataGrid',
    slot: 'CollapsibleTrigger',
})(({ ownerState }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    padding: vars.spacing(0, 1.5),
    border: `1px solid ${vars.colors.border.base}`,
    background: 'none',
    outline: 'none',
    borderTopLeftRadius: vars.radius.base,
    borderTopRightRadius: vars.radius.base,
    borderBottomLeftRadius: ownerState.open ? 0 : vars.radius.base,
    borderBottomRightRadius: ownerState.open ? 0 : vars.radius.base,
    '&:hover': {
        backgroundColor: vars.colors.interactive.hover,
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: `2px solid ${vars.colors.interactive.selected}`,
        outlineOffset: -2,
    },
}));
const CollapsibleIcon = styled('div', {
    name: 'MuiDataGrid',
    slot: 'CollapsibleIcon',
})(({ ownerState }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.colors.foreground.muted,
    transform: ownerState.open ? 'none' : 'rotate(180deg)',
    transition: vars.transition(['transform'], {
        duration: vars.transitions.duration.short,
        easing: vars.transitions.easing.easeInOut,
    }),
}));
function CollapsibleTrigger(props) {
    const { children, className, ...other } = props;
    const rootProps = useGridRootProps();
    const { open, onOpenChange, panelId } = useCollapsibleContext();
    const ownerState = { classes: rootProps.classes, open };
    const classes = useUtilityClasses(ownerState);
    return (_jsxs(CollapsibleTriggerRoot, { ownerState: ownerState, className: clsx(classes.root, className), tabIndex: 0, "aria-controls": open ? panelId : undefined, "aria-expanded": !open, onClick: () => onOpenChange(!open), ...other, children: [children, _jsx(CollapsibleIcon, { ownerState: ownerState, className: classes.icon, children: _jsx(rootProps.slots.collapsibleIcon, {}) })] }));
}
export { CollapsibleTrigger };
