import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridSidebarContentSelector } from '../../hooks/features/sidebar';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['sidebar'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const SidebarRoot = styled(ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'Sidebar',
})({
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    minWidth: 260,
    maxWidth: 400,
    overflow: 'hidden',
});
function Sidebar(props) {
    const { className, children, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const { value, sidebarId, labelId } = useGridSelector(apiRef, gridSidebarContentSelector);
    if (!value) {
        return null;
    }
    const sidebarContent = apiRef.current.unstable_applyPipeProcessors('sidebar', null, value);
    if (!sidebarContent) {
        return null;
    }
    return (_jsxs(SidebarRoot, { id: sidebarId, className: clsx(className, classes.root), ownerState: rootProps, "aria-labelledby": labelId, ...other, children: [_jsx(ResizablePanelHandle, {}), sidebarContent] }));
}
export { Sidebar };
