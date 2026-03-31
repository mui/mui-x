'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator, } from './GridColumnHeaderSeparator';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const GridGenericColumnHeaderItem = forwardRef(function GridGenericColumnHeaderItem(props, ref) {
    const { classes, columnMenuOpen, colIndex, height, isResizing, sortDirection, hasFocus, tabIndex, separatorSide, isDraggable, headerComponent, description, elementId, width, columnMenuIconButton = null, columnMenu = null, columnTitleIconButtons = null, headerClassName, label, resizable, draggableContainerProps, columnHeaderSeparatorProps, style, ...other } = props;
    const rootProps = useGridRootProps();
    const headerCellRef = React.useRef(null);
    const handleRef = useForkRef(headerCellRef, ref);
    let ariaSort = 'none';
    if (sortDirection != null) {
        ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return (_jsxs("div", { className: clsx(classes.root, headerClassName), style: {
            ...style,
            width,
        }, role: "columnheader", tabIndex: tabIndex, "aria-colindex": colIndex + 1, "aria-sort": ariaSort, ...other, ref: handleRef, children: [_jsxs("div", { className: classes.draggableContainer, draggable: isDraggable, role: "presentation", ...draggableContainerProps, children: [_jsxs("div", { className: classes.titleContainer, role: "presentation", children: [_jsx("div", { className: classes.titleContainerContent, children: headerComponent !== undefined ? (headerComponent) : (_jsx(GridColumnHeaderTitle, { label: label, description: description, columnWidth: width })) }), columnTitleIconButtons] }), columnMenuIconButton] }), _jsx(GridColumnHeaderSeparator, { resizable: !rootProps.disableColumnResize && !!resizable, resizing: isResizing, height: height, side: separatorSide, ...columnHeaderSeparatorProps }), columnMenu] }));
});
export { GridGenericColumnHeaderItem };
