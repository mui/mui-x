import * as React from 'react';
import { styled } from '@mui/system';
import type {
  GridChartsConfigurationSection,
  GridChartsConfigurationControl,
} from '@mui/x-internals/types';
import { vars } from '@mui/x-data-grid-pro/internals';
import { GridOverlay, GridShadowScrollArea } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../../hooks/utils/useGridChartIntegration';
import { Collapsible } from '../../collapsible/Collapsible';
import { CollapsibleTrigger } from '../../collapsible/CollapsibleTrigger';
import { CollapsiblePanel } from '../../collapsible/CollapsiblePanel';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../../../hooks/features/chartsIntegration/useGridChartsIntegration';

interface GridChartsPanelCustomizeProps {
  activeChartId: string;
  sections: GridChartsConfigurationSection[];
}

type OwnerState = DataGridPremiumProcessedProps;

const GridChartsPanelCustomizeRoot = styled(GridShadowScrollArea)({
  height: '100%',
});

const GridChartsPanelCustomizeSection = styled(Collapsible, {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelCustomizeSection',
})<{ ownerState: OwnerState }>({
  margin: vars.spacing(0.5, 1),
});

const GridChartsPanelCustomizePanel = styled(CollapsiblePanel, {
  name: 'MuiDataGrid',
  slot: 'chartsPanelSection',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  padding: vars.spacing(2, 1.5),
  gap: vars.spacing(3),
});

const GridChartsPanelCustomizePanelTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelCustomizePanelTitle',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
});

export function GridChartsPanelCustomize(props: GridChartsPanelCustomizeProps) {
  const { activeChartId, sections } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();

  const {
    type: chartType,
    configuration,
    dimensions,
    values,
  } = chartStateLookup[activeChartId] ?? EMPTY_CHART_INTEGRATION_CONTEXT_STATE;

  const handleChange = (field: string, value: any) => {
    setChartState(activeChartId, {
      ...configuration,
      configuration: { ...configuration, [field]: value },
    });
  };

  if (chartType === '') {
    return <GridOverlay>{apiRef.current.getLocaleText('chartsChartNotSelected')}</GridOverlay>;
  }

  return (
    <GridChartsPanelCustomizeRoot>
      {sections.map((section, index) => (
        <GridChartsPanelCustomizeSection
          key={section.id}
          initiallyOpen={index === 0}
          ownerState={rootProps}
        >
          <CollapsibleTrigger>
            <GridChartsPanelCustomizePanelTitle ownerState={rootProps}>
              {section.label}
            </GridChartsPanelCustomizePanelTitle>
          </CollapsibleTrigger>
          <GridChartsPanelCustomizePanel ownerState={rootProps}>
            {Object.entries(section.controls).map(([key, optRaw]) => {
              const opt = optRaw as GridChartsConfigurationControl;
              const context = { configuration, dimensions, values };
              const isHidden = opt.isHidden?.(context) ?? false;
              if (isHidden) {
                return null;
              }
              const isDisabled = opt.isDisabled?.(context) ?? false;
              if (opt.type === 'boolean') {
                return (
                  <rootProps.slots.baseSwitch
                    key={key}
                    checked={Boolean(configuration[key] ?? opt.default)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(key, event.target.checked)
                    }
                    size="small"
                    label={opt.label}
                    disabled={isDisabled}
                    {...rootProps.slotProps?.baseSwitch}
                  />
                );
              }
              if (opt.type === 'select') {
                return (
                  <rootProps.slots.baseSelect
                    key={key}
                    fullWidth
                    size="small"
                    label={opt.label}
                    value={configuration[key] ?? opt.default}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      handleChange(key, event.target.value)
                    }
                    disabled={isDisabled}
                    slotProps={{
                      htmlInput: {
                        ...opt.htmlAttributes,
                      },
                    }}
                    {...rootProps.slotProps?.baseSelect}
                  >
                    {(opt.options || []).map((option) => (
                      <rootProps.slots.baseSelectOption
                        key={option.value}
                        value={option.value}
                        native={false}
                      >
                        {option.content}
                      </rootProps.slots.baseSelectOption>
                    ))}
                  </rootProps.slots.baseSelect>
                );
              }
              // string or number
              return (
                <rootProps.slots.baseTextField
                  key={key}
                  aria-label={opt.label}
                  placeholder={opt.label}
                  label={opt.label}
                  type={opt.type === 'number' ? 'number' : 'text'}
                  size="small"
                  fullWidth
                  disabled={isDisabled}
                  slotProps={{
                    htmlInput: {
                      ...opt.htmlAttributes,
                    },
                  }}
                  {...rootProps.slotProps?.baseTextField}
                  value={(configuration[key] ?? opt.default ?? '').toString()}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(
                      key,
                      opt.type === 'number' ? Number(event.target.value) : event.target.value,
                    )
                  }
                />
              );
            })}
          </GridChartsPanelCustomizePanel>
        </GridChartsPanelCustomizeSection>
      ))}
    </GridChartsPanelCustomizeRoot>
  );
}
