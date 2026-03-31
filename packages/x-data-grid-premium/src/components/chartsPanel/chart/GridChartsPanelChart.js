import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['chartsManagement'],
        chartTypeRoot: ['chartTypeRoot'],
        button: ['chartTypeSelectorButton'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridChartsManagementRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsManagement',
})({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
});
const GridChartTypeRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartTypeRoot',
})({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: vars.spacing(1),
    padding: vars.spacing(1),
});
const GridChartTypeButton = styled('button', {
    name: 'MuiDataGrid',
    slot: 'ChartTypeSelectorButton',
    shouldForwardProp: (prop) => prop !== 'isSelected',
})(({ isSelected }) => {
    return {
        backgroundColor: isSelected
            ? `color-mix(in srgb, ${vars.colors.interactive.selected} calc(${vars.colors.interactive.selectedOpacity} * 100%), ${vars.colors.background.base})`
            : vars.colors.background.base,
        color: isSelected ? vars.colors.interactive.selected : vars.colors.foreground.muted,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: vars.spacing(0.5),
        padding: vars.spacing(1.5, 1, 1),
        border: `1px solid ${isSelected ? vars.colors.interactive.selected : vars.colors.border.base}`,
        font: vars.typography.font.small,
        fontWeight: vars.typography.fontWeight.medium,
        borderRadius: vars.radius.base,
        transition: vars.transition(['border-color', 'background-color', 'color'], {
            duration: vars.transitions.duration.short,
            easing: vars.transitions.easing.easeInOut,
        }),
        '&:hover': {
            backgroundColor: isSelected
                ? `color-mix(in srgb, ${vars.colors.interactive.selected} calc(${vars.colors.interactive.selectedOpacity} * 100%), ${vars.colors.background.base})`
                : vars.colors.interactive.hover,
        },
    };
});
function GridChartsPanelChart(props) {
    const { schema, selectedChartType, onChartTypeChange } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridChartsManagementRoot, { ownerState: rootProps, className: classes.root, children: _jsx(GridChartTypeRoot, { className: classes.chartTypeRoot, children: Object.entries(schema).map(([type, config]) => (_jsxs(GridChartTypeButton, { className: classes.button, isSelected: type === selectedChartType, onClick: () => onChartTypeChange(type), ...rootProps.slotProps?.baseButton, children: [_jsx(config.icon, { style: { width: 32, height: 32 } }), config.label] }, type))) }) }));
}
GridChartsPanelChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    schema: PropTypes.object,
};
export { GridChartsPanelChart };
