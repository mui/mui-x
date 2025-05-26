import * as React from 'react';
import { styled } from '@mui/system';
import { useGridRootProps } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';

export interface GridChartsConfigurationPanelProps {
  schema?: Record<string, any>;
}

interface ChartTypeButtonProps {
  isSelected?: boolean;
}

const ChartTypeButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ChartTypeButton',
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<ChartTypeButtonProps>(({ isSelected }) => {
  return {
    backgroundColor: isSelected ? vars.colors.interactive.hover : vars.colors.background.base,
    color: isSelected ? vars.colors.interactive.selected : vars.colors.foreground.base,
    border: 'none',
    padding: 8,
    cursor: 'pointer',
  };
});

function GridChartsConfigurationPanel(props: GridChartsConfigurationPanelProps) {
  const { schema } = props; // TODO: take props into account
  const { configuration, setChartType, chartType } = useGridChartsIntegrationContext();
  const rootProps = useGridRootProps();
  return (
    <React.Fragment>
      {configuration.chartType?.map((type: string) => (
        <ChartTypeButton
          key={type}
          isSelected={type === chartType}
          onClick={() => setChartType(type)}
          {...rootProps.slotProps?.baseButton}
        >
          {type}
        </ChartTypeButton>
      ))}
    </React.Fragment>
  );
}

export { GridChartsConfigurationPanel };
