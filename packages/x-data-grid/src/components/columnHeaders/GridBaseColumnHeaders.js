'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['columnHeaders'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridColumnHeadersRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaders',
})({
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
    borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
});
export const GridBaseColumnHeaders = forwardRef(function GridColumnHeaders(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridColumnHeadersRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, role: "presentation", ref: ref }));
});
