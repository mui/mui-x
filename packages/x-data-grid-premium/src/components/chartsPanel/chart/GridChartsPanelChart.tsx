import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export interface GridChartsPanelChartProps {
  selectedChartType: string;
  onChartTypeChange: (type: string) => void;
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['chartsManagement'],
    chartTypeRoot: ['chartTypeRoot'],
    button: ['chartTypeSelectorButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface ChartTypeButtonProps {
  isSelected?: boolean;
}

const GridChartsManagementRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsManagement',
})<{ ownerState: OwnerState }>({
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
})<ChartTypeButtonProps>(({ isSelected }) => {
  return {
    backgroundColor: isSelected ? vars.colors.interactive.hover : vars.colors.background.base,
    color: isSelected ? vars.colors.interactive.selected : vars.colors.foreground.muted,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.spacing(0.5),
    padding: vars.spacing(1.5, 1, 1),
    border: `1px solid ${vars.colors.border.base}`,
    font: vars.typography.font.small,
    borderRadius: vars.radius.base,
    transition: vars.transition(['border-color', 'background-color'], {
      duration: vars.transitions.duration.short,
      easing: vars.transitions.easing.easeInOut,
    }),
    '&:hover': {
      backgroundColor: vars.colors.interactive.hover,
    },
  };
});

function GridChartsPanelChart(props: GridChartsPanelChartProps) {
  const { selectedChartType, onChartTypeChange } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const chartConfig = rootProps.slotProps?.chartsPanel?.schema || {};

  return (
    <GridChartsManagementRoot ownerState={rootProps} className={classes.root}>
      <GridChartTypeRoot className={classes.chartTypeRoot}>
        {Object.entries(chartConfig).map(([type, config]) => (
          <GridChartTypeButton
            key={type}
            className={classes.button}
            isSelected={type === selectedChartType}
            onClick={() => onChartTypeChange(type)}
            {...rootProps.slotProps?.baseButton}
          >
            <config.icon style={{ width: 32, height: 32 }} />
            {config.label}
          </GridChartTypeButton>
        ))}
      </GridChartTypeRoot>
    </GridChartsManagementRoot>
  );
}

GridChartsPanelChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  schema: PropTypes.object,
} as any;

export { GridChartsPanelChart };
