'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridCellEditStopReasons } from '../../models/params/gridEditCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { getValueFromValueOptions, getValueOptions, isSingleSelectColDef, } from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
function isKeyboardEvent(event) {
    return 'key' in event && !!event.key;
}
function GridEditSingleSelectCell(props) {
    const rootProps = useGridRootProps();
    const { id, value: valueProp, formattedValue, api, field, row, rowNode, colDef, cellMode, isEditable, tabIndex, className, hasFocus, isValidating, isProcessingProps, error, onValueChange, initialOpen = rootProps.editMode === GridEditModes.Cell, slotProps, ...other } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef(null);
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(initialOpen);
    const baseSelectProps = rootProps.slotProps?.baseSelect || {};
    const isSelectNative = baseSelectProps.native ?? false;
    useEnhancedEffect(() => {
        if (hasFocus) {
            inputRef.current?.focus();
        }
    }, [hasFocus]);
    if (!isSingleSelectColDef(colDef)) {
        return null;
    }
    const valueOptions = getValueOptions(colDef, { id, row });
    if (!valueOptions) {
        return null;
    }
    const getOptionValue = colDef.getOptionValue;
    const getOptionLabel = colDef.getOptionLabel;
    const handleChange = async (event) => {
        if (!isSingleSelectColDef(colDef) || !valueOptions) {
            return;
        }
        setOpen(false);
        const target = event.target;
        // NativeSelect casts the value to a string.
        const formattedTargetValue = getValueFromValueOptions(target.value, valueOptions, getOptionValue);
        if (onValueChange) {
            await onValueChange(event, formattedTargetValue);
        }
        await apiRef.current.setEditCellValue({ id, field, value: formattedTargetValue }, event);
    };
    const handleClose = (event, reason) => {
        if (rootProps.editMode === GridEditModes.Row) {
            setOpen(false);
            return;
        }
        if (reason === 'backdropClick' || event.key === 'Escape') {
            const params = apiRef.current.getCellParams(id, field);
            apiRef.current.publishEvent('cellEditStop', {
                ...params,
                reason: event.key === 'Escape'
                    ? GridCellEditStopReasons.escapeKeyDown
                    : GridCellEditStopReasons.cellFocusOut,
            });
        }
    };
    const handleOpen = (event) => {
        if (isKeyboardEvent(event) && event.key === 'Enter') {
            return;
        }
        setOpen(true);
    };
    if (!valueOptions || !colDef) {
        return null;
    }
    return (_jsx(rootProps.slots.baseSelect, { ref: ref, value: valueProp, onChange: handleChange, open: open, onOpen: handleOpen, onClose: handleClose, error: error, native: isSelectNative, fullWidth: true, slotProps: {
            htmlInput: {
                ref: inputRef,
            },
        }, ...other, ...slotProps?.root, ...rootProps.slotProps?.baseSelect, children: valueOptions.map((valueOption) => {
            const value = getOptionValue(valueOption);
            return (_createElement(rootProps.slots.baseSelectOption, { ...(rootProps.slotProps?.baseSelectOption || {}), native: isSelectNative, key: value, value: value }, getOptionLabel(valueOption)));
        }) }));
}
GridEditSingleSelectCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * GridApi that let you manipulate the grid.
     */
    api: PropTypes.object.isRequired,
    /**
     * The mode of the cell.
     */
    cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
    changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The column field of the cell that triggered the event.
     */
    field: PropTypes.string.isRequired,
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: PropTypes.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: PropTypes.bool.isRequired,
    /**
     * The grid row id.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
     * If true, the select opens by default.
     */
    initialOpen: PropTypes.bool,
    /**
     * If true, the cell is editable.
     */
    isEditable: PropTypes.bool,
    isProcessingProps: PropTypes.bool,
    isValidating: PropTypes.bool,
    /**
     * Callback called when the value is changed by the user.
     * @param {Event<any>} event The event source of the callback.
     * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
     * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
     */
    onValueChange: PropTypes.func,
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: PropTypes.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: PropTypes.object.isRequired,
    /**
     * the tabIndex value.
     */
    tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.any,
};
export { GridEditSingleSelectCell };
export const renderEditSingleSelectCell = (params) => (_jsx(GridEditSingleSelectCell, { ...params }));
