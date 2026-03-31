import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        container: ['pivotPanelSearchContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPivotPanelSearchContainer = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSearchContainer',
})({
    padding: vars.spacing(0, 1, 1),
});
function GridPivotPanelSearch(props) {
    const { onClear, value, onChange } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClear();
        }
    };
    return (_jsx(GridPivotPanelSearchContainer, { ownerState: rootProps, className: classes.container, children: _jsx(rootProps.slots.baseTextField, { size: "small", "aria-label": apiRef.current.getLocaleText('pivotSearchControlLabel'), placeholder: apiRef.current.getLocaleText('pivotSearchControlPlaceholder'), onKeyDown: handleKeyDown, fullWidth: true, slotProps: {
                input: {
                    startAdornment: _jsx(rootProps.slots.pivotSearchIcon, { fontSize: "small" }),
                    endAdornment: value ? (_jsx(rootProps.slots.baseIconButton, { edge: "end", size: "small", onClick: onClear, "aria-label": apiRef.current.getLocaleText('pivotSearchControlClear'), children: _jsx(rootProps.slots.pivotSearchClearIcon, { fontSize: "small" }) })) : null,
                },
                htmlInput: {
                    role: 'searchbox',
                },
            }, ...rootProps.slotProps?.baseTextField, value: value, onChange: onChange }) }));
}
export { GridPivotPanelSearch };
