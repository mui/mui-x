'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['panelWrapper'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPanelWrapperRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PanelWrapper',
})({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '&:focus': {
        outline: 0,
    },
});
const GridPanelWrapper = forwardRef(function GridPanelWrapper(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridPanelWrapperRoot, { tabIndex: -1, className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref }));
});
export { GridPanelWrapper };
