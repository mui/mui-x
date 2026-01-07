import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridStateInitializer,
  GridPipeProcessor,
  useGridApiMethod,
  useGridRegisterPipeProcessor,
  GridRestoreStatePreProcessingContext,
  useGridEventPriority,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridSidebarStateSelector } from './gridSidebarSelector';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
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
  const { initialState, onSidebarClose, onSidebarOpen } = props;
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
        initialState?.sidebar != null ||
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
    [apiRef, initialState?.sidebar],
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
  useGridEventPriority(apiRef, 'sidebarClose', onSidebarClose);
  useGridEventPriority(apiRef, 'sidebarOpen', onSidebarOpen);
};
