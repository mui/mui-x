'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['footerContainer', 'withBorderColor'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridFooterContainerRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FooterContainer',
})({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 52,
    borderTop: '1px solid',
});
const GridFooterContainer = forwardRef(function GridFooterContainer(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridFooterContainerRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref }));
});
GridFooterContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
    ]),
};
export { GridFooterContainer };
