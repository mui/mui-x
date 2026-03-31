import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useCollapsibleContext } from './CollapsibleContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['collapsiblePanel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const CollapsiblePanelRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'CollapsiblePanel',
})({
    border: `1px solid ${vars.colors.border.base}`,
    borderTop: 'none',
    borderBottomLeftRadius: vars.radius.base,
    borderBottomRightRadius: vars.radius.base,
    flex: 1,
    overflow: 'hidden',
});
function CollapsiblePanel(props) {
    const { 'aria-label': ariaLabel, children, className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const id = useId();
    const { open } = useCollapsibleContext();
    if (!open) {
        return null;
    }
    return (_jsx(CollapsiblePanelRoot, { ownerState: rootProps, className: clsx(classes.root, className), id: id, ...other, children: children }));
}
export { CollapsiblePanel };
