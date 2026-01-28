import * as React from 'react';
import {
  GridToolbar,
  GridToolbarDivider,
  type GridToolbarProps,
  useGridSelector,
} from '@mui/x-data-grid-pro/internals';
import { ColumnsPanelTrigger, FilterPanelTrigger, ToolbarButton } from '@mui/x-data-grid-pro';
import { ExportExcel } from './export';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { PivotPanelTrigger } from './pivotPanel/PivotPanelTrigger';
import { AiAssistantPanelTrigger } from './aiAssistantPanel';
import { ChartsPanelTrigger } from './chartsPanel/ChartsPanelTrigger';
import {
  gridHistoryCanRedoSelector,
  gridHistoryCanUndoSelector,
  gridHistoryEnabledSelector,
} from '../hooks/features/history';

export function GridPremiumToolbar(props: GridToolbarProps) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const { excelOptions, ...other } = props;

  const historyEnabled = useGridSelector(apiRef, gridHistoryEnabledSelector);
  const showHistoryControls =
    rootProps.slotProps?.toolbar?.showHistoryControls !== false && historyEnabled;
  const canUndo = useGridSelector(apiRef, gridHistoryCanUndoSelector);
  const canRedo = useGridSelector(apiRef, gridHistoryCanRedoSelector);

  const mainControls = (
    <React.Fragment>
      {showHistoryControls && (
        <React.Fragment>
          <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarUndo')}>
            <div>
              <ToolbarButton disabled={!canUndo} onClick={() => apiRef.current.history.undo()}>
                <rootProps.slots.undoIcon fontSize="small" />
              </ToolbarButton>
            </div>
          </rootProps.slots.baseTooltip>
          <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarRedo')}>
            <div>
              <ToolbarButton disabled={!canRedo} onClick={() => apiRef.current.history.redo()}>
                <rootProps.slots.redoIcon fontSize="small" />
              </ToolbarButton>
            </div>
          </rootProps.slots.baseTooltip>
        </React.Fragment>
      )}
      {showHistoryControls && <GridToolbarDivider />}
      {!rootProps.disableColumnSelector && (
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarColumns')}>
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <rootProps.slots.columnSelectorIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </rootProps.slots.baseTooltip>
      )}
      {!rootProps.disableColumnFilter && (
        <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarFilters')}>
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton
                {...triggerProps}
                color={state.filterCount > 0 ? 'primary' : 'default'}
              >
                <rootProps.slots.baseBadge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <rootProps.slots.openFilterButtonIcon fontSize="small" />
                </rootProps.slots.baseBadge>
              </ToolbarButton>
            )}
          />
        </rootProps.slots.baseTooltip>
      )}
      {!rootProps.disablePivoting && (
        <PivotPanelTrigger
          render={(triggerProps, state) => (
            <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarPivot')}>
              <ToolbarButton {...triggerProps} color={state.active ? 'primary' : 'default'}>
                <rootProps.slots.pivotIcon fontSize="small" />
              </ToolbarButton>
            </rootProps.slots.baseTooltip>
          )}
        />
      )}
      {rootProps.experimentalFeatures?.charts && rootProps.chartsIntegration && (
        <ChartsPanelTrigger
          render={(triggerProps) => (
            <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarCharts')}>
              <ToolbarButton {...triggerProps} color="default">
                <rootProps.slots.chartsIcon fontSize="small" />
              </ToolbarButton>
            </rootProps.slots.baseTooltip>
          )}
        />
      )}
      {rootProps.aiAssistant && (
        <AiAssistantPanelTrigger
          render={(triggerProps) => (
            <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('toolbarAssistant')}>
              <ToolbarButton {...triggerProps} color="default">
                <rootProps.slots.aiAssistantIcon fontSize="small" />
              </ToolbarButton>
            </rootProps.slots.baseTooltip>
          )}
        />
      )}
    </React.Fragment>
  );

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
      mainControls={mainControls}
      additionalExportMenuItems={additionalExportMenuItems}
    />
  );
}
