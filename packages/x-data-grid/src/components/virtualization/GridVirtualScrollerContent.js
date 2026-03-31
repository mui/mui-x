'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
const useUtilityClasses = (props, overflowedContent) => {
    const { classes } = props;
    const slots = {
        root: ['virtualScrollerContent', overflowedContent && 'virtualScrollerContent--overflowed'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const VirtualScrollerContentRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'VirtualScrollerContent',
    overridesResolver: (props, styles) => {
        const { ownerState } = props;
        return [
            styles.virtualScrollerContent,
            ownerState.overflowedContent && styles['virtualScrollerContent--overflowed'],
        ];
    },
})({});
const GridVirtualScrollerContent = forwardRef(function GridVirtualScrollerContent(props, ref) {
    const rootProps = useGridRootProps();
    const overflowedContent = !rootProps.autoHeight && props.style?.minHeight === 'auto';
    const classes = useUtilityClasses(rootProps, overflowedContent);
    const ownerState = { classes: rootProps.classes, overflowedContent };
    return (_jsx(VirtualScrollerContentRoot, { ...props, ownerState: ownerState, className: clsx(classes.root, props.className), ref: ref }));
});
export { GridVirtualScrollerContent };
