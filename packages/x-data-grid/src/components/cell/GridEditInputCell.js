'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['editInputCell'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridEditInputCellRoot = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'EditInputCell',
})({
    font: vars.typography.font.body,
    padding: '1px 0',
    '& input': {
        padding: '0 16px',
        height: '100%',
    },
});
const GridEditInputCell = forwardRef((props, ref) => {
    const rootProps = useGridRootProps();
    const { id, value, formattedValue, api, field, row, rowNode, colDef, cellMode, isEditable, tabIndex, hasFocus, isValidating, debounceMs = 200, isProcessingProps, onValueChange, slotProps, ...other } = props;
    const apiRef = useGridApiContext();
    const inputRef = React.useRef(null);
    const [valueState, setValueState] = React.useState(value);
    const classes = useUtilityClasses(rootProps);
    const handleChange = React.useCallback(async (event) => {
        const newValue = event.target.value;
        const column = apiRef.current.getColumn(field);
        let parsedValue = newValue;
        if (column.valueParser) {
            parsedValue = column.valueParser(newValue, apiRef.current.getRow(id), column, apiRef);
        }
        setValueState(parsedValue);
        apiRef.current.setEditCellValue({ id, field, value: parsedValue, debounceMs, unstable_skipValueParser: true }, event);
        if (onValueChange) {
            await onValueChange(event, newValue);
        }
    }, [apiRef, debounceMs, field, id, onValueChange]);
    const meta = apiRef.current.unstable_getEditCellMeta(id, field);
    React.useEffect(() => {
        if (meta?.changeReason !== 'debouncedSetEditCellValue') {
            setValueState(value);
        }
    }, [meta, value]);
    useEnhancedEffect(() => {
        if (hasFocus) {
            inputRef.current.focus();
        }
    }, [hasFocus]);
    return (_jsx(GridEditInputCellRoot, { as: rootProps.slots.baseInput, inputRef: inputRef, className: classes.root, ownerState: rootProps, fullWidth: true, type: colDef.type === 'number' ? colDef.type : 'text', value: valueState ?? '', onChange: handleChange, endAdornment: isProcessingProps ? _jsx(rootProps.slots.loadIcon, { fontSize: "small", color: "action" }) : undefined, ...other, ...slotProps?.root, ref: ref }));
});
export { GridEditInputCell };
export const renderEditInputCell = (params) => (_jsx(GridEditInputCell, { ...params }));
