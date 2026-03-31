import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        container: ['chartsPanelDataSearchContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridChartsPanelDataSearchContainer = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSearchContainer',
})({
    padding: vars.spacing(1),
});
function GridChartsPanelDataSearch(props) {
    const { onClear, value, onChange } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClear();
        }
    };
    return (_jsx(GridChartsPanelDataSearchContainer, { ownerState: rootProps, className: classes.container, children: _jsx(rootProps.slots.baseTextField, { size: "small", "aria-label": apiRef.current.getLocaleText('chartsSearchLabel'), placeholder: apiRef.current.getLocaleText('chartsSearchPlaceholder'), onKeyDown: handleKeyDown, fullWidth: true, slotProps: {
                input: {
                    startAdornment: _jsx(rootProps.slots.chartsSearchIcon, { fontSize: "small" }),
                    endAdornment: value ? (_jsx(rootProps.slots.baseIconButton, { edge: "end", size: "small", onClick: onClear, "aria-label": apiRef.current.getLocaleText('chartsSearchClear'), children: _jsx(rootProps.slots.chartsSearchClearIcon, { fontSize: "small" }) })) : null,
                },
                htmlInput: {
                    role: 'searchbox',
                },
            }, ...rootProps.slotProps?.baseTextField, value: value, onChange: onChange }) }));
}
export { GridChartsPanelDataSearch };
