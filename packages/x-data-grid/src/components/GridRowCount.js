'use client';
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../constants/cssVariables';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['rowCount'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridRowCountRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'RowCount',
})({
    alignItems: 'center',
    display: 'flex',
    margin: vars.spacing(0, 2),
});
const GridRowCount = forwardRef(function GridRowCount(props, ref) {
    const { className, rowCount, visibleRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const ownerState = useGridRootProps();
    const classes = useUtilityClasses(ownerState);
    if (rowCount === 0) {
        return null;
    }
    const text = visibleRowCount < rowCount
        ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
        : rowCount.toLocaleString();
    return (_jsxs(GridRowCountRoot, { className: clsx(classes.root, className), ownerState: ownerState, ...other, ref: ref, children: [apiRef.current.getLocaleText('footerTotalRows'), " ", text] }));
});
GridRowCount.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    rowCount: PropTypes.number.isRequired,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
    ]),
    visibleRowCount: PropTypes.number.isRequired,
};
export { GridRowCount };
