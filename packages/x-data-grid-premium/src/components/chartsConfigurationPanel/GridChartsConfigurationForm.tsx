import * as React from 'react';
import { styled } from '@mui/system';
import { NotRendered } from '@mui/x-data-grid-pro/internals';
import { GridSlotProps } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridChartsConfigurationSection } from '../../models/gridChartsIntegration';

type OwnerState = DataGridPremiumProcessedProps;

const GridChartsConfigSwitch = styled(NotRendered<GridSlotProps['baseSwitch']>, {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationForm',
})<{ ownerState: OwnerState }>({});

export function GridChartsConfigurationForm() {
  const rootProps = useGridRootProps();
  const { chartType, configuration, categories, series, setConfiguration } =
    useGridChartsIntegrationContext();

  // TODO: take sections into account when rendering the form
  const sections: GridChartsConfigurationSection[] = React.useMemo(() => {
    return rootProps.slotProps?.chartsConfigurationPanel?.schema?.[chartType]?.customization || [];
  }, [rootProps.slotProps?.chartsConfigurationPanel?.schema, chartType]);

  const handleChange = (field: string, value: any) => {
    setConfiguration({ ...configuration, [field]: value });
  };

  if (chartType === '') {
    return <div style={{ padding: 16 }}>Select a chart type to configure options.</div>;
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {sections.map((section) =>
        Object.entries(section.controls).map(([key, optRaw]) => {
          const opt = optRaw as any;

          const context = { configuration, categories, series };
          const isHidden = opt.isHidden?.(context) ?? false;
          if (isHidden) {
            return null;
          }

          const isDisabled = opt.isDisabled?.(context) ?? false;

          if (opt.type === 'boolean') {
            return (
              <GridChartsConfigSwitch
                key={key}
                as={rootProps.slots.baseSwitch}
                ownerState={rootProps}
                checked={!!configuration[key]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(key, event.target.checked)
                }
                size="small"
                label={opt.label}
                disabled={isDisabled}
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
                {...rootProps.slotProps?.baseSelect}
              >
                {(opt.options || []).map((option: string) => (
                  <rootProps.slots.baseSelectOption key={option} value={option} native={false}>
                    {option}
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
        }),
      )}
    </form>
  );
}
