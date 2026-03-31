'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['iconButtonContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridIconButtonContainerRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'IconButtonContainer',
})(() => ({
    display: 'flex',
    visibility: 'hidden',
    width: 0,
}));
export const GridIconButtonContainer = forwardRef(function GridIconButtonContainer(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridIconButtonContainerRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref }));
});
