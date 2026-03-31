'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRowHeightSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['longTextCell'],
        content: ['longTextCellContent'],
        expandButton: ['longTextCellExpandButton'],
        collapseButton: ['longTextCellCollapseButton'],
        popup: ['longTextCellPopup'],
        popperContent: ['longTextCellPopperContent'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridLongTextCellRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'LongTextCell',
})({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
});
const GridLongTextCellContent = styled('div', {
    name: 'MuiDataGrid',
    slot: 'LongTextCellContent',
})({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
});
const GridLongTextCellPopperContent = styled('div', {
    name: 'MuiDataGrid',
    slot: 'LongTextCellPopperContent',
})(({ theme }) => ({
    ...theme.typography.body2,
    letterSpacing: 'normal',
    paddingBlock: 15.5,
    paddingInline: 9,
    maxHeight: 52 * 3,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    width: 'var(--_width)',
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
    boxSizing: 'border-box',
}));
const GridLongTextCellCornerButton = styled('button', {
    name: 'MuiDataGrid',
    slot: 'LongTextCellCornerButton',
})(({ theme }) => ({
    lineHeight: 0,
    position: 'absolute',
    bottom: 1,
    right: 0,
    border: '1px solid',
    color: (theme.vars || theme).palette.text.secondary,
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    borderRadius: 0,
    fontSize: '0.875rem',
    padding: 2,
    '&:focus-visible': {
        outline: 'none',
    },
    '&:hover': {
        backgroundColor: (theme.vars || theme).palette.background.paper,
        color: (theme.vars || theme).palette.text.primary,
    },
    [`&.${gridClasses.longTextCellExpandButton}`]: {
        right: -9,
        opacity: 0,
        [`.${gridClasses.longTextCell}:hover &, .${gridClasses.longTextCell}.Mui-focused &`]: {
            opacity: 1,
        },
    },
    [`&.${gridClasses.longTextCellCollapseButton}`]: {
        bottom: 2,
        right: 2,
        border: 'none',
    },
}));
const GridLongTextCellPopper = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'LongTextCellPopper',
})(({ theme }) => ({
    zIndex: vars.zIndex.menu,
    background: (theme.vars || theme).palette.background.paper,
    '&[data-popper-reference-hidden]': {
        visibility: 'hidden',
        pointerEvents: 'none',
    },
}));
function GridLongTextCell(props) {
    const { id, value = '', colDef, hasFocus, slotProps, renderContent } = props;
    const popupId = `${id}-${colDef.field}-longtext-popup`;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const rowHeight = useGridSelector(apiRef, gridRowHeightSelector);
    const [popupOpen, setPopupOpen] = React.useState(false);
    const cellRef = React.useRef(null);
    const cornerButtonRef = React.useRef(null);
    React.useEffect(() => {
        if (hasFocus && !popupOpen) {
            if (cornerButtonRef.current && cornerButtonRef.current !== document.activeElement) {
                cornerButtonRef.current.focus();
            }
        }
        if (!hasFocus) {
            setPopupOpen(false);
        }
    }, [hasFocus, popupOpen]);
    const handleExpandClick = (event) => {
        // event.detail === 0 means keyboard-triggered click (Enter keyup on focused button)
        // Ignore these to prevent popup from opening when focus moves to this cell via Enter
        if (event.detail === 0) {
            return;
        }
        event.stopPropagation();
        setPopupOpen(true);
    };
    const handleExpandKeyDown = (event) => {
        if (event.key === ' ' && !event.shiftKey) {
            event.preventDefault(); // Prevent native button click on keyup
            event.stopPropagation(); // Prevent grid row selection
            setPopupOpen((prev) => !prev);
        }
        if (event.key === 'Escape' && popupOpen) {
            event.stopPropagation(); // Prevent grid cell navigation
            setPopupOpen(false);
        }
    };
    const handleClickAway = () => {
        setPopupOpen(false);
    };
    const handleCollapseClick = (event) => {
        event.stopPropagation();
        setPopupOpen(false);
        apiRef.current.getCellElement(id, colDef.field)?.focus();
    };
    return (_jsxs(GridLongTextCellRoot, { ref: cellRef, ...slotProps?.root, className: clsx(classes.root, hasFocus && 'Mui-focused', slotProps?.root?.className), children: [_jsx(GridLongTextCellContent, { ...slotProps?.content, className: clsx(classes.content, slotProps?.content?.className), children: value }), _jsx(GridLongTextCellCornerButton, { ref: cornerButtonRef, "aria-label": `${value}, ${apiRef.current.getLocaleText('longTextCellExpandLabel')}`, "aria-haspopup": "dialog", "aria-controls": popupOpen ? popupId : undefined, "aria-expanded": popupOpen, "aria-keyshortcuts": "Space", tabIndex: 0, ...slotProps?.expandButton, className: clsx(classes.expandButton, slotProps?.expandButton?.className), onClick: handleExpandClick, onKeyDown: handleExpandKeyDown, children: _jsx(rootProps.slots.longTextCellExpandIcon, { fontSize: "inherit" }) }), _jsx(GridLongTextCellPopper, { id: popupId, role: "dialog", "aria-label": colDef.headerName || colDef.field, as: rootProps.slots.basePopper, ownerState: rootProps, open: popupOpen, target: cellRef.current, placement: "bottom-start", onClickAway: handleClickAway, clickAwayMouseEvent: "onMouseDown", flip: true, material: {
                    container: cellRef.current?.closest('[role="row"]'),
                    modifiers: [
                        {
                            name: 'offset',
                            options: { offset: [-10, -rowHeight] },
                        },
                    ],
                }, ...slotProps?.popper, className: clsx(classes.popup, slotProps?.popper?.className), children: _jsxs(GridLongTextCellPopperContent, { tabIndex: -1, onKeyDown: (event) => {
                        if (event.key === 'Escape') {
                            event.stopPropagation();
                            setPopupOpen(false);
                            apiRef.current.getCellElement(id, colDef.field)?.focus();
                        }
                    }, ...slotProps?.popperContent, className: clsx(classes.popperContent, slotProps?.popperContent?.className), style: {
                        '--_width': `${colDef.computedWidth}px`,
                        ...slotProps?.popperContent?.style,
                    }, children: [renderContent ? renderContent(value) : value, _jsx(GridLongTextCellCornerButton, { "aria-label": apiRef.current.getLocaleText('longTextCellCollapseLabel'), "aria-keyshortcuts": "Escape", ...slotProps?.collapseButton, className: clsx(classes.collapseButton, slotProps?.collapseButton?.className), onClick: handleCollapseClick, children: _jsx(rootProps.slots.longTextCellCollapseIcon, { fontSize: "inherit" }) })] }) })] }));
}
export { GridLongTextCell };
export const renderLongTextCell = (params) => (_jsx(GridLongTextCell, { ...params }));
