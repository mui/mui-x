'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay } from './containers/GridOverlay';
const GridNoRowsOverlay = forwardRef(function GridNoRowsOverlay(props, ref) {
    const apiRef = useGridApiContext();
    const noRowsLabel = apiRef.current.getLocaleText('noRowsLabel');
    return (_jsx(GridOverlay, { ...props, ref: ref, children: noRowsLabel }));
});
GridNoRowsOverlay.propTypes = {
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
export { GridNoRowsOverlay };
