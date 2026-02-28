import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import {
  type GridStateInitializer,
  type GridPipeProcessor,
  useGridApiMethod,
  useGridRegisterPipeProcessor,
  type GridRestoreStatePreProcessingContext,
  useGridEventPriority,
} from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridSidebarStateSelector } from './gridSidebarSelector';
import type { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { GridSidebarApi } from './gridSidebarInterfaces';

export const sidebarStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'initialState'>
> = (state, props) => ({
  ...state,
  sidebar: props.initialState?.sidebar ?? { open: false },
});

export const useGridSidebar = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'initialState' | 'onSidebarClose' | 'onSidebarOpen'>,
): void => {
  const hideSidebar = React.useCallback(() => {
    apiRef.current.setState((state) => {
      if (!state.sidebar.open || !state.sidebar.value) {
        return state;
      }

      apiRef.current.publishEvent('sidebarClose', {
        value: state.sidebar.value,
      });
      return { ...state, sidebar: { open: false } };
    });
  }, [apiRef]);

  const showSidebar = React.useCallback<GridSidebarApi['showSidebar']>(
    (newValue, sidebarId, labelId) => {
      apiRef.current.setState((state) => ({
        ...state,
        sidebar: {
          ...state.sidebar,
          open: true,
          value: newValue,
          sidebarId,
          labelId,
        },
      }));
      apiRef.current.publishEvent('sidebarOpen', {
        value: newValue,
      });
    },
    [apiRef],
  );

  useGridApiMethod(
    apiRef,
    {
      showSidebar,
      hideSidebar,
    },
    'public',
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const sidebarToExport = gridSidebarStateSelector(apiRef);

      const shouldExportSidebar =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the sidebar was initialized
        props.initialState?.sidebar != null ||
        // Always export if the sidebar is opened
        sidebarToExport.open;

      if (!shouldExportSidebar) {
        return prevState;
      }

      return {
        ...prevState,
        sidebar: sidebarToExport,
      };
    },
    [apiRef, props.initialState?.sidebar],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      const sidebar = context.stateToRestore.sidebar;
      if (sidebar != null) {
        apiRef.current.setState((state) => ({
          ...state,
          sidebar,
        }));
      }

      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridEventPriority(apiRef, 'sidebarClose', props.onSidebarClose);
  useGridEventPriority(apiRef, 'sidebarOpen', props.onSidebarOpen);
};
