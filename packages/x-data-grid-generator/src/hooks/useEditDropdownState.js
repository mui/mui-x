'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridCellEditStopReasons, GridEditModes, useGridApiContext, useGridRootProps, } from '@mui/x-data-grid-premium';
import { useRowEditHandlers } from './useRowEditHandlers';
/**
 * Hook that manages dropdown state and keyboard handling for custom edit cells
 * with dropdowns (Select, Autocomplete).
 *
 * Provides:
 * - Auto-open on mount if cell had focus when edit started
 * - Focus management when tabbing into the cell
 * - Keyboard handlers for Tab, Enter, Escape that work in both cell and row edit modes
 * - Handlers for Select and Autocomplete components
 */
export function useEditDropdownState(params) {
    const { id, field, hasFocus } = params;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const inputRef = React.useRef(null);
    // Only auto-open if this cell had focus when edit started
    const shouldAutoOpen = React.useRef(hasFocus).current;
    const [open, setOpen] = React.useState(shouldAutoOpen);
    // Track open state in a ref for event handlers that need current value
    const openRef = React.useRef(open);
    openRef.current = open;
    const isRowEditMode = rootProps.editMode === GridEditModes.Row;
    const closeMenu = React.useCallback(() => setOpen(false), []);
    const { handleTabKeyDown, handleMenuKeyDown } = useRowEditHandlers({
        id,
        field,
        onClose: closeMenu,
    });
    // Focus input when hasFocus becomes true (e.g., when tabbing into this cell)
    useEnhancedEffect(() => {
        if (hasFocus) {
            inputRef.current?.focus();
        }
    }, [hasFocus]);
    /**
     * Handler for Select's onKeyDown - handles Tab when menu is closed
     */
    const handleSelectKeyDown = React.useCallback((event) => {
        if (event.key === 'Tab') {
            handleTabKeyDown(event);
        }
    }, [handleTabKeyDown]);
    /**
     * Handler for Select's MenuProps.onClose - closes menu and exits cell edit on backdrop click
     */
    const handleSelectMenuClose = React.useCallback((event, reason) => {
        setOpen(false);
        if (reason === 'backdropClick' &&
            rootProps.editMode === GridEditModes.Cell &&
            apiRef.current.getCellMode(id, field) === 'edit') {
            const cellParams = apiRef.current.getCellParams(id, field);
            apiRef.current.publishEvent('cellEditStop', {
                ...cellParams,
                reason: GridCellEditStopReasons.cellFocusOut,
            });
        }
    }, [apiRef, id, field, rootProps.editMode]);
    /**
     * Creates a change handler for Select that closes menu and optionally exits edit mode
     */
    const createSelectChangeHandler = React.useCallback((getValue) => {
        return async (event) => {
            // Close menu after selection
            setOpen(false);
            const newValue = getValue(event);
            const isValid = await apiRef.current.setEditCellValue({ id, field, value: newValue }, event);
            // In cell edit mode, selecting closes the menu and exits edit mode
            // In row edit mode, selecting only closes the menu (already done above)
            // Check if still in edit mode to avoid double-exit when Enter key also triggers grid's handler
            if (isValid && !isRowEditMode && apiRef.current.getCellMode(id, field) === 'edit') {
                const cellParams = apiRef.current.getCellParams(id, field);
                apiRef.current.publishEvent('cellEditStop', {
                    ...cellParams,
                    reason: GridCellEditStopReasons.enterKeyDown,
                });
            }
        };
    }, [apiRef, id, field, isRowEditMode]);
    /**
     * Handler for Autocomplete's InputBase onKeyDown - handles Tab
     */
    const handleAutocompleteInputKeyDown = React.useCallback((event) => {
        if (event.key === 'Tab') {
            handleTabKeyDown(event);
        }
    }, [handleTabKeyDown]);
    /**
     * Handler for Autocomplete's wrapper div - stops Enter/Escape only when dropdown is open
     */
    const handleAutocompleteWrapperKeyDown = React.useCallback((event) => {
        if (isRowEditMode && openRef.current && (event.key === 'Enter' || event.key === 'Escape')) {
            event.stopPropagation();
        }
    }, [isRowEditMode]);
    /**
     * Creates a change handler for Autocomplete that optionally exits edit mode
     */
    const createAutocompleteChangeHandler = React.useCallback((transformValue) => {
        return async (event, newValue) => {
            const valueToSet = transformValue ? transformValue(newValue) : newValue;
            await apiRef.current.setEditCellValue({ id, field, value: valueToSet }, event);
            // In cell edit mode, selecting exits edit mode
            // In row edit mode, selecting only closes the dropdown (Autocomplete handles this)
            // Check if still in edit mode to avoid double-exit when Enter key also triggers grid's handler
            if (!isRowEditMode && apiRef.current.getCellMode(id, field) === 'edit') {
                apiRef.current.stopCellEditMode({ id, field });
            }
        };
    }, [apiRef, id, field, isRowEditMode]);
    return {
        // State
        open,
        setOpen,
        inputRef,
        shouldAutoOpen,
        // Select handlers
        handleSelectKeyDown,
        handleSelectMenuClose,
        handleSelectMenuListKeyDown: handleMenuKeyDown,
        createSelectChangeHandler,
        // Autocomplete handlers
        handleAutocompleteInputKeyDown,
        handleAutocompleteWrapperKeyDown,
        createAutocompleteChangeHandler,
    };
}
