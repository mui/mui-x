'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridOverlay } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
const GridEmptyPivotOverlay = forwardRef(function GridEmptyPivotOverlay(props, ref) {
    const apiRef = useGridApiContext();
    return (_jsx(GridOverlay, { ...props, ref: ref, children: apiRef.current.getLocaleText('emptyPivotOverlayLabel') }));
});
GridEmptyPivotOverlay.propTypes = {
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
export { GridEmptyPivotOverlay };
