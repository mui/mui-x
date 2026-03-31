'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { vars } from '../../constants/cssVariables';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
const GridFooterCellRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'FooterCell',
})({
    fontWeight: vars.typography.fontWeight.medium,
    color: vars.colors.foreground.accent,
});
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['footerCell'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridFooterCellRaw(props) {
    const { formattedValue, colDef, cellMode, row, api, id, value, rowNode, field, hasFocus, tabIndex, isEditable, ...other } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    return (_jsx(GridFooterCellRoot, { ownerState: ownerState, className: classes.root, ...other, children: formattedValue }));
}
const GridFooterCell = React.memo(GridFooterCellRaw);
export { GridFooterCell };
