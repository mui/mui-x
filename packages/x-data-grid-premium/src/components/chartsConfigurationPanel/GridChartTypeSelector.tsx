import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsConfigurationOptions } from '../../models/gridChartsIntegration';

export interface GridChartTypeSelectorProps {
  schema: GridChartsConfigurationOptions;
}

interface ChartTypeButtonProps {
  isSelected?: boolean;
}

const ChartTypeButtonRow = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  padding: 8,
});

const ChartTypeButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ChartTypeButton',
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<ChartTypeButtonProps>(({ isSelected }) => {
  return {
    backgroundColor: isSelected ? vars.colors.interactive.hover : vars.colors.background.base,
    color: isSelected ? vars.colors.interactive.selected : vars.colors.foreground.muted,
    cursor: 'pointer',
    minWidth: 88,
    minHeight: 88,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    border: `1px solid ${vars.colors.border.base}`,
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

function GridChartTypeSelector() {
  const { setChartType, chartType } = useGridChartsIntegrationContext();
  const rootProps = useGridRootProps();
  const chartConfig = rootProps.slotProps?.chartsConfigurationPanel?.schema || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ChartTypeButtonRow>
        {Object.entries(chartConfig).map(([type, config]) => (
          <ChartTypeButton
            key={type}
            isSelected={type === chartType}
            onClick={() => setChartType(type)}
            {...rootProps.slotProps?.baseButton}
          >
            <config.icon style={{ width: 48, height: 48 }} />
            {config.label}
          </ChartTypeButton>
        ))}
      </ChartTypeButtonRow>
    </div>
  );
}

GridChartTypeSelector.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  schema: PropTypes.object,
} as any;

export { GridChartTypeSelector };
