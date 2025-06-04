import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { useGridRootProps } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsIcon } from '../../material/icons';

export interface GridChartTypeSelectorProps {
  schema?: Record<string, any>;
}

interface ChartTypeButtonProps {
  isSelected?: boolean;
}

const ChartTypeButtonRow = styled('div')({
  display: 'flex',
  gap: 4,
  padding: 4,
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
    width: 96,
    height: 96,
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

function GridChartTypeSelector(props: GridChartTypeSelectorProps) {
  const { schema } = props;
  const {
    configuration: contextConfiguration,
    setChartType,
    chartType,
  } = useGridChartsIntegrationContext();

  const configuration = React.useMemo(
    () => ({ ...contextConfiguration, ...(schema || {}) }),
    [contextConfiguration, schema],
  );
  const rootProps = useGridRootProps();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ChartTypeButtonRow>
        {configuration.chartType?.map((type: string) => (
          <ChartTypeButton
            key={type}
            isSelected={type === chartType}
            onClick={() => setChartType(type)}
            {...rootProps.slotProps?.baseButton}
          >
            <GridChartsIcon />
            {`${type.charAt(0).toUpperCase()}${type.slice(1)} chart`}
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
