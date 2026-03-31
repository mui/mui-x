import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['sidebarHeader'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const SidebarHeaderRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'SidebarHeader',
})({
    position: 'sticky',
    top: 0,
    borderBottom: `1px solid ${vars.colors.border.base}`,
});
function SidebarHeader(props) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(SidebarHeaderRoot, { className: clsx(className, classes.root), ownerState: rootProps, ...other, children: children }));
}
export { SidebarHeader };
