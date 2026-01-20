import * as React from 'react';
import { GridToolbar, GridToolbarProps } from '@mui/x-data-grid-pro/internals';
import { ToolbarButton } from '@mui/x-data-grid-pro';
import { ExportExcel } from './export';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { PivotPanelTrigger } from './pivotPanel/PivotPanelTrigger';
import { AiAssistantPanelTrigger } from './aiAssistantPanel';
import { ChartsPanelTrigger } from './chartsPanel/ChartsPanelTrigger';

export function GridPremiumToolbar(props: GridToolbarProps) {
  const {
    slots,
    slotProps,
    disablePivoting,
    experimentalFeatures,
    chartsIntegration,
    aiAssistant,
  } = useGridRootProps();
  const apiRef = useGridApiContext();
  const { excelOptions, ...other } = props;

  const additionalItems = (
    <React.Fragment>
      {!disablePivoting && (
        <PivotPanelTrigger
          render={(triggerProps, state) => (
            <slots.baseTooltip title={apiRef.current.getLocaleText('toolbarPivot')}>
              <ToolbarButton {...triggerProps} color={state.active ? 'primary' : 'default'}>
                <slots.pivotIcon fontSize="small" />
              </ToolbarButton>
            </slots.baseTooltip>
          )}
        />
      )}
      {experimentalFeatures?.charts && chartsIntegration && (
        <ChartsPanelTrigger
          render={(triggerProps) => (
            <slots.baseTooltip title={apiRef.current.getLocaleText('toolbarCharts')}>
              <ToolbarButton {...triggerProps} color="default">
                <slots.chartsIcon fontSize="small" />
              </ToolbarButton>
            </slots.baseTooltip>
          )}
        />
      )}
      {aiAssistant && (
        <AiAssistantPanelTrigger
          render={(triggerProps) => (
            <slots.baseTooltip title={apiRef.current.getLocaleText('toolbarAssistant')}>
              <ToolbarButton {...triggerProps} color="default">
                <slots.aiAssistantIcon fontSize="small" />
              </ToolbarButton>
            </slots.baseTooltip>
          )}
        />
      )}
    </React.Fragment>
  );

  const additionalExportMenuItems = !props.excelOptions?.disableToolbarButton
    ? (onMenuItemClick: () => void) => (
        <ExportExcel
          render={<slots.baseMenuItem {...slotProps?.baseMenuItem} />}
          options={props.excelOptions}
          onClick={onMenuItemClick}
        >
          {apiRef.current.getLocaleText('toolbarExportExcel')}
        </ExportExcel>
      )
    : undefined;

  return (
    <GridToolbar
      {...other}
      additionalItems={additionalItems}
      additionalExportMenuItems={additionalExportMenuItems}
    />
  );
}
