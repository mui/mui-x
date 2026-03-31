'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { ResizablePanelContext } from './ResizablePanelContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['resizablePanel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const ResizablePanelRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ResizablePanel',
})({
    position: 'relative',
});
function ResizablePanel(props) {
    const { className, children, direction = 'horizontal', ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const ref = React.useRef(null);
    const contextValue = React.useMemo(() => ({ rootRef: ref, direction }), [direction]);
    return (_jsx(ResizablePanelContext.Provider, { value: contextValue, children: _jsx(ResizablePanelRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref, children: children }) }));
}
export { ResizablePanel };
