import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { useGridRootProps } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsIcon } from '../../material/icons';

export interface GridChartsConfigurationPanelProps {
  schema?: Record<string, any>;
}

interface ChartTypeButtonProps {
  isSelected?: boolean;
}

const ChartTypeButtonRow = styled('div')({
  display: 'flex',
  gap: 4,
  padding: 4,
  width: '100%',
});

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
    width: 96,
    height: 96,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    gap: 4,
    transition: 'background-color 0.2s, color 0.2s',
    '&:hover': {
      backgroundColor: vars.colors.interactive.hover,
      color: vars.colors.interactive.selected,
    },
  };
});

function GridChartsConfigurationPanel(props: GridChartsConfigurationPanelProps) {
  const { schema } = props; // TODO: take props into account
  const { configuration, setChartType, chartType } = useGridChartsIntegrationContext();
  const rootProps = useGridRootProps();
  return (
    <ChartTypeButtonRow>
      {configuration.chartType?.map((type: string) => (
        <ChartTypeButton
          key={type}
          isSelected={type === chartType}
          onClick={() => setChartType(type)}
          {...rootProps.slotProps?.baseButton}
        >
          <GridChartsIcon />
          <span style={{ fontSize: 12, marginTop: 4 }}>
            {`${type.charAt(0).toUpperCase()}${type.slice(1)} chart`}
          </span>
        </ChartTypeButton>
      ))}
    </ChartTypeButtonRow>
  );
}

GridChartsConfigurationPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  schema: PropTypes.object,
} as any;

export { GridChartsConfigurationPanel };
