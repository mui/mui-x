'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { Toolbar } from '../toolbarV8';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['toolbarContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridToolbarContainerRoot = styled(Toolbar, {
    name: 'MuiDataGrid',
    slot: 'ToolbarContainer',
    shouldForwardProp: (prop) => prop !== 'ownerState',
})({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: vars.spacing(1),
    padding: vars.spacing(0.5),
    minHeight: 'auto',
});
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/toolbar/ Toolbar} component instead. This component will be removed in a future major release.
 */
const GridToolbarContainer = forwardRef(function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    if (!children) {
        return null;
    }
    return (_jsx(GridToolbarContainerRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref, children: children }));
});
GridToolbarContainer.propTypes = {
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
export { GridToolbarContainer };
