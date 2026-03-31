import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, gridClasses, GridColumnHeaderTitle, } from '@mui/x-data-grid';
import { vars } from '@mui/x-data-grid/internals';
import { getAggregationFunctionLabel } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
const GridAggregationHeaderRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'AggregationColumnHeader',
    overridesResolver: (props, styles) => {
        const { ownerState } = props;
        return [
            styles.aggregationColumnHeader,
            ownerState.colDef.headerAlign &&
                styles[`aggregationColumnHeader--align${capitalize(ownerState.colDef.headerAlign)}`],
        ];
    },
})({
    display: 'flex',
    flexDirection: 'column',
    [`&.${gridClasses['aggregationColumnHeader--alignRight']}`]: {
        alignItems: 'flex-end',
    },
    [`&.${gridClasses['aggregationColumnHeader--alignCenter']}`]: {
        alignItems: 'center',
    },
});
const GridAggregationFunctionLabel = styled('div', {
    name: 'MuiDataGrid',
    slot: 'AggregationColumnHeaderLabel',
})({
    font: vars.typography.font.small,
    lineHeight: 'normal',
    color: vars.colors.foreground.muted,
    marginTop: -1,
});
const useUtilityClasses = (ownerState) => {
    const { classes, colDef } = ownerState;
    const slots = {
        root: [
            'aggregationColumnHeader',
            colDef.headerAlign && `aggregationColumnHeader--align${capitalize(colDef.headerAlign)}`,
        ],
        aggregationLabel: ['aggregationColumnHeaderLabel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridAggregationHeader(props) {
    const { renderHeader, ...params } = props;
    const { colDef, aggregation } = params;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { ...rootProps, classes: rootProps.classes, colDef };
    const classes = useUtilityClasses(ownerState);
    if (!aggregation) {
        return null;
    }
    const aggregationLabel = getAggregationFunctionLabel({
        apiRef,
        aggregationRule: aggregation.aggregationRule,
    });
    return (_jsxs(GridAggregationHeaderRoot, { ownerState: ownerState, className: classes.root, children: [renderHeader ? (renderHeader(params)) : (_jsx(GridColumnHeaderTitle, { label: colDef.headerName ?? colDef.field, description: colDef.description, columnWidth: colDef.computedWidth })), _jsx(GridAggregationFunctionLabel, { ownerState: ownerState, className: classes.aggregationLabel, children: aggregationLabel })] }));
}
export { GridAggregationHeader };
