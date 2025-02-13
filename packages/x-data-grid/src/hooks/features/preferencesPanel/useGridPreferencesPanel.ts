import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPreferencePanelStateSelector } from './gridPreferencePanelSelector';
import { GridPreferencesPanelApi } from '../../../models/api/gridPreferencesPanelApi';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const preferencePanelStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState'>
> = (state, props) => ({
  ...state,
  preferencePanel: props.initialState?.preferencePanel ?? { open: false },
});

/**
 * TODO: Add a single `setPreferencePanel` method to avoid multiple `setState`
 */
export const useGridPreferencesPanel = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'initialState'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridPreferencesPanel');

  /**
   * API METHODS
   */
  const hidePreferences = React.useCallback(() => {
    apiRef.current.setState((state) => {
      if (!state.preferencePanel.open) {
        return state;
      }

      logger.debug('Hiding Preferences Panel');
      const preferencePanelState = gridPreferencePanelStateSelector(apiRef);
      apiRef.current.publishEvent('preferencePanelClose', {
        openedPanelValue: preferencePanelState.openedPanelValue,
      });
      return { ...state, preferencePanel: { open: false } };
    });
  }, [apiRef, logger]);

  const showPreferences = React.useCallback<GridPreferencesPanelApi['showPreferences']>(
    (newValue, panelId, labelId) => {
      logger.debug('Opening Preferences Panel');
      apiRef.current.setState((state) => ({
        ...state,
        preferencePanel: {
          ...state.preferencePanel,
          open: true,
          openedPanelValue: newValue,
          panelId,
          labelId,
        },
      }));
      apiRef.current.publishEvent('preferencePanelOpen', {
        openedPanelValue: newValue,
      });
    },
    [logger, apiRef],
  );

  useGridApiMethod(
    apiRef,
    {
      showPreferences,
      hidePreferences,
    },
    'public',
  );

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const preferencePanelToExport = gridPreferencePanelStateSelector(apiRef);

      const shouldExportPreferencePanel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the panel was initialized
        props.initialState?.preferencePanel != null ||
        // Always export if the panel is opened
        preferencePanelToExport.open;

      if (!shouldExportPreferencePanel) {
        return prevState;
      }

      return {
        ...prevState,
        preferencePanel: preferencePanelToExport,
      };
    },
    [apiRef, props.initialState?.preferencePanel],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const preferencePanel = context.stateToRestore.preferencePanel;
      if (preferencePanel != null) {
        apiRef.current.setState((state) => ({
          ...state,
          preferencePanel,
        }));
      }

      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
};
