'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { forwardRef } from '@mui/x-internals/forwardRef';
import useForkRef from '@mui/utils/useForkRef';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPanelContext } from '../panel/GridPanelContext';
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/columns-panel/ Columns Panel Trigger} component instead. This component will be removed in a future major release.
 */
const GridToolbarColumnsButton = forwardRef(function GridToolbarColumnsButton(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const columnButtonId = useId();
    const columnPanelId = useId();
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { columnsPanelTriggerRef } = useGridPanelContext();
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const handleRef = useForkRef(ref, columnsPanelTriggerRef);
    const showColumns = (event) => {
        if (preferencePanel.open &&
            preferencePanel.openedPanelValue === GridPreferencePanelsValue.columns) {
            apiRef.current.hidePreferences();
        }
        else {
            apiRef.current.showPreferences(GridPreferencePanelsValue.columns, columnPanelId, columnButtonId);
        }
        buttonProps.onClick?.(event);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
        return null;
    }
    const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;
    return (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarColumnsLabel'), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, ...tooltipProps, children: _jsx(rootProps.slots.baseButton, { id: columnButtonId, size: "small", "aria-label": apiRef.current.getLocaleText('toolbarColumnsLabel'), "aria-haspopup": "menu", "aria-expanded": isOpen, "aria-controls": isOpen ? columnPanelId : undefined, startIcon: _jsx(rootProps.slots.columnSelectorIcon, {}), ...rootProps.slotProps?.baseButton, ...buttonProps, onPointerUp: (event) => {
                if (preferencePanel.open) {
                    event.stopPropagation();
                }
                buttonProps.onPointerUp?.(event);
            }, onClick: showColumns, ref: handleRef, children: apiRef.current.getLocaleText('toolbarColumns') }) }));
});
GridToolbarColumnsButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: PropTypes.object,
};
export { GridToolbarColumnsButton };
