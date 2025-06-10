import * as React from 'react';
import { styled } from '@mui/system';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsConfigurationSection } from '../../models/gridChartsIntegration';
import { Collapsible } from '../collapsible/Collapsible';
import { CollapsibleTrigger } from '../collapsible/CollapsibleTrigger';
import { CollapsiblePanel } from '../collapsible/CollapsiblePanel';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = DataGridPremiumProcessedProps;

const GridChartsConfigurationFormRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 8,
  overflowY: 'auto',
});

const GridChartsConfigurationFormPanel = styled(CollapsiblePanel, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationPanelSection',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  gap: 16,
});

export function GridChartsConfigurationForm() {
  const rootProps = useGridRootProps();
  const { chartType, configuration, categories, series, setConfiguration } =
    useGridChartsIntegrationContext();

  const sections: GridChartsConfigurationSection[] = React.useMemo(() => {
    return rootProps.slotProps?.chartsConfigurationPanel?.schema?.[chartType]?.customization || [];
  }, [rootProps.slotProps?.chartsConfigurationPanel?.schema, chartType]);

  const handleChange = (field: string, value: any) => {
    // TODO: keep configuration per chart type but share color palette state
    setConfiguration({ ...configuration, [field]: value });
  };

  if (chartType === '') {
    return <div style={{ padding: 16 }}>Select a chart type to configure options.</div>;
  }

  return (
    <GridChartsConfigurationFormRoot>
      {sections.map((section, index) => (
        <Collapsible key={section.id} initiallyOpen={index === 0}>
          <CollapsibleTrigger>{section.label}</CollapsibleTrigger>
          <GridChartsConfigurationFormPanel ownerState={rootProps}>
            {Object.entries(section.controls).map(([key, optRaw]) => {
              const opt = optRaw as any;
              const context = { configuration, categories, series };
              const isHidden = opt.isHidden?.(context) ?? false;
              if (isHidden) {
                return null;
              }
              const isDisabled = opt.isDisabled?.(context) ?? false;
              if (opt.type === 'boolean') {
                return (
                  <rootProps.slots.baseSwitch
                    key={key}
                    checked={!!configuration[key]}
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
                    {(opt.options || []).map((option: { label: string; value: string }) => (
                      <rootProps.slots.baseSelectOption
                        key={option.value}
                        value={option.value}
                        native={false}
                      >
                        {option.label}
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
                  fullWidth
                  disabled={isDisabled}
                  slotProps={{
                    htmlInput: {
                      ...opt.htmlAttributes,
                    },
                  }}
                  {...rootProps.slotProps?.baseTextField}
                  value={configuration[key] ?? opt.default}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(
                      key,
                      opt.type === 'number' ? Number(event.target.value) : event.target.value,
                    )
                  }
                />
              );
            })}
          </GridChartsConfigurationFormPanel>
        </Collapsible>
      ))}
    </GridChartsConfigurationFormRoot>
  );
}
