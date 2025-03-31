import * as React from 'react';
import { ToolbarButton } from '@mui/x-data-grid-pro';
import { GridToolbar, GridToolbarProps } from '@mui/x-data-grid-pro/internals';
import { ExportExcel } from './export';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { AiAssistantPanelTrigger } from './aiAssistantPanel';
import { isAiAssistantAvailable } from '../hooks/features/prompt/utils';

export function GridPremiumToolbar(props: GridToolbarProps) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const { excelOptions, ...other } = props;

  const additionalItems = isAiAssistantAvailable(rootProps) ? (
    <AiAssistantPanelTrigger
      render={(triggerProps) => (
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarAssistant')}>
          <ToolbarButton {...triggerProps} color="default">
            <rootProps.slots.aiAssistantIcon fontSize="small" />
          </ToolbarButton>
        </rootProps.slots.baseTooltip>
      )}
    />
  ) : undefined;

  const additionalExportMenuItems = !props.excelOptions?.disableToolbarButton
    ? (onMenuItemClick: () => void) => (
        <ExportExcel
          render={<rootProps.slots.baseMenuItem {...rootProps.slotProps?.baseMenuItem} />}
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
