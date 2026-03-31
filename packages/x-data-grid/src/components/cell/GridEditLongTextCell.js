'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowHeightSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['editLongTextCell'],
        value: ['editLongTextCellValue'],
        popup: ['editLongTextCellPopup'],
        popperContent: ['editLongTextCellPopperContent'],
        textarea: ['editLongTextCellTextarea'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridEditLongTextCellTextarea = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'EditLongTextCellTextarea',
})(({ theme }) => ({
    width: '100%',
    padding: 0,
    ...theme.typography.body2,
    letterSpacing: 'normal',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    resize: 'vertical',
}));
const GridEditLongTextCellRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'EditLongTextCell',
})({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
});
const GridEditLongTextCellValue = styled('div', {
    name: 'MuiDataGrid',
    slot: 'EditLongTextCellValue',
})({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    paddingInline: 10,
});
const GridEditLongTextCellPopper = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'EditLongTextCellPopper',
})(({ theme }) => ({
    zIndex: vars.zIndex.menu,
    background: (theme.vars || theme).palette.background.paper,
    '&[data-popper-reference-hidden]': {
        opacity: 0, // use opacity to preserve focus.
    },
}));
const GridEditLongTextCellPopperContent = styled('div', {
    name: 'MuiDataGrid',
    slot: 'EditLongTextCellPopperContent',
})(({ theme }) => ({
    ...theme.typography.body2,
    letterSpacing: 'normal',
    paddingBlock: 15.5,
    paddingInline: 9,
    height: 'max-content',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    width: 'var(--_width)',
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
    boxShadow: (theme.vars || theme).shadows[4],
    boxSizing: 'border-box',
}));
function GridEditLongTextCell(props) {
    const { id, value, field, colDef, hasFocus, cellMode, slotProps } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
    const [valueState, setValueState] = React.useState(value);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const meta = apiRef.current.unstable_getEditCellMeta(id, field);
    const popupId = `${id}-${field}-longtext-edit-popup`;
    // Only show popup when this cell has focus
    // This fixes editMode="row" where all cells enter edit mode simultaneously
    const showPopup = hasFocus && Boolean(anchorEl);
    React.useEffect(() => {
        if (meta?.changeReason !== 'debouncedSetEditCellValue') {
            setValueState(value);
        }
    }, [meta, value]);
    return (_jsxs(GridEditLongTextCellRoot, { tabIndex: cellMode === 'edit' && rootProps.editMode === 'row' ? 0 : undefined, ref: setAnchorEl, "aria-controls": showPopup ? popupId : undefined, "aria-expanded": showPopup, ...slotProps?.root, className: clsx(classes.root, slotProps?.root?.className), children: [_jsx(GridEditLongTextCellValue, { ...slotProps?.value, className: clsx(classes.value, slotProps?.value?.className), children: valueState }), _jsx(GridEditLongTextCellPopper, { as: rootProps.slots.basePopper, ownerState: rootProps, id: popupId, role: "dialog", "aria-label": colDef.headerName || field, open: showPopup, target: anchorEl, placement: "bottom-start", flip: true, material: {
                    container: anchorEl?.closest('[role="row"]'),
                    modifiers: [
                        {
                            name: 'offset',
                            options: { offset: [-1, -rowHeight] },
                        },
                    ],
                }, ...slotProps?.popper, className: clsx(classes.popup, slotProps?.popper?.className), children: _jsx(GridEditLongTextCellPopperContent, { ...slotProps?.popperContent, className: clsx(classes.popperContent, slotProps?.popperContent?.className), style: { '--_width': `${colDef.computedWidth}px` }, children: _jsx(GridEditLongTextarea, { ...props, valueState: valueState, setValueState: setValueState }) }) })] }));
}
function GridEditLongTextarea(props) {
    const { id, field, colDef, debounceMs = 200, onValueChange, valueState, setValueState, hasFocus, slotProps, } = props;
    const textareaRef = React.useRef(null);
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    useEnhancedEffect(() => {
        if (hasFocus && textareaRef.current) {
            // preventScroll: the popper is portaled into the GridRow, so focusing
            // without it triggers the browser to scroll the grid container which is undesirable.
            textareaRef.current.focus({ preventScroll: true });
            // Move cursor to end of text
            const length = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(length, length);
        }
    }, [hasFocus]);
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
    }, [apiRef, debounceMs, field, id, onValueChange, setValueState]);
    const handleKeyDown = React.useCallback((event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            // Shift+Enter: let textarea handle newline, stop propagation to prevent grid from exiting edit
            event.stopPropagation();
        }
        if (rootProps.editMode === 'cell' && event.key === 'Escape') {
            apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
        }
    }, [apiRef, field, id, rootProps.editMode]);
    return (_jsx(GridEditLongTextCellTextarea, { ref: textareaRef, as: rootProps.slots.baseTextarea, ownerState: rootProps, "aria-label": colDef.headerName || field, value: valueState ?? '', onChange: handleChange, onKeyDown: handleKeyDown, ...slotProps?.textarea, className: clsx(classes.textarea, slotProps?.textarea?.className) }));
}
export { GridEditLongTextCell };
export const renderEditLongTextCell = (params) => (_jsx(GridEditLongTextCell, { ...params }));
