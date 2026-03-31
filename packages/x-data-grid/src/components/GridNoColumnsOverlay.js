'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay } from './containers/GridOverlay';
import { GridPreferencePanelsValue } from '../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { gridColumnFieldsSelector, useGridSelector } from '../hooks';
const GridNoColumnsOverlay = forwardRef(function GridNoColumnsOverlay(props, ref) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const columns = useGridSelector(apiRef, gridColumnFieldsSelector);
    const handleOpenManageColumns = () => {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    };
    const showManageColumnsButton = !rootProps.disableColumnSelector && columns.length > 0;
    return (_jsxs(GridOverlay, { ...props, ref: ref, children: [apiRef.current.getLocaleText('noColumnsOverlayLabel'), showManageColumnsButton && (_jsx(rootProps.slots.baseButton, { size: "small", ...rootProps.slotProps?.baseButton, onClick: handleOpenManageColumns, children: apiRef.current.getLocaleText('noColumnsOverlayManageColumns') }))] }));
});
GridNoColumnsOverlay.propTypes = {
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
export { GridNoColumnsOverlay };
