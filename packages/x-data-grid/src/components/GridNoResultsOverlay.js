'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay } from './containers/GridOverlay';
export const GridNoResultsOverlay = forwardRef(function GridNoResultsOverlay(props, ref) {
    const apiRef = useGridApiContext();
    const noResultsOverlayLabel = apiRef.current.getLocaleText('noResultsOverlayLabel');
    return (_jsx(GridOverlay, { ...props, ref: ref, children: noResultsOverlayLabel }));
});
