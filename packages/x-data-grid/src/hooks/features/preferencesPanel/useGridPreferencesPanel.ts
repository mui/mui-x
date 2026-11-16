import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import type { GridPipeProcessor } from '../../core/pipeProcessing';
import { gridPreferencePanelStateSelector } from './gridPreferencePanelSelector';
import type { GridPreferencesPanelApi } from '../../../models/api/gridPreferencesPanelApi';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';

const getDefaultPreferencePanelId = (apiRef: RefObject<GridPrivateApiCommunity>) =>
  `mui-x-preference-panel-${apiRef.current.instanceId.id}`;

export const preferencePanelStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState'>,
  GridPrivateApiCommunity
> = (state, props, apiRef) => {
  const initialPreferencePanel = props.initialState?.preferencePanel;
  return {
    ...state,
    preferencePanel: initialPreferencePanel
      ? {
          ...initialPreferencePanel,
          ...(initialPreferencePanel.open && {
            panelId: initialPreferencePanel.panelId ?? getDefaultPreferencePanelId(apiRef),
          }),
        }
      : { open: false },
  };
};

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
      apiRef.current.setState((state) => {
        // Re-opening the same panel from an entry point without ids (column menu, overlay, API)
        // preserves the ids already bound to it so `aria-controls` and `aria-labelledby` stay valid.
        const keepIds =
          state.preferencePanel.open && state.preferencePanel.openedPanelValue === newValue;
        return {
          ...state,
          preferencePanel: {
            ...state.preferencePanel,
            open: true,
            openedPanelValue: newValue,
            panelId:
              panelId ??
              (keepIds && state.preferencePanel.panelId
                ? state.preferencePanel.panelId
                : getDefaultPreferencePanelId(apiRef)),
            labelId: labelId ?? (keepIds ? state.preferencePanel.labelId : undefined),
          },
        };
      });
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
        preferencePanel: preferencePanelToExport.open
          ? {
              ...preferencePanelToExport,
              panelId: undefined,
              labelId: undefined,
            }
          : preferencePanelToExport,
      };
    },
    [apiRef, props.initialState?.preferencePanel],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const preferencePanel = context.stateToRestore.preferencePanel;
      if (preferencePanel != null) {
        apiRef.current.setState((state) => {
          const keepIds =
            preferencePanel.open &&
            state.preferencePanel.open &&
            preferencePanel.openedPanelValue !== undefined &&
            preferencePanel.openedPanelValue === state.preferencePanel.openedPanelValue;
          return {
            ...state,
            preferencePanel: preferencePanel.open
              ? {
                  ...preferencePanel,
                  panelId:
                    (keepIds ? state.preferencePanel.panelId : preferencePanel.panelId) ??
                    getDefaultPreferencePanelId(apiRef),
                  labelId: keepIds ? state.preferencePanel.labelId : preferencePanel.labelId,
                }
              : preferencePanel,
          };
        });
      }

      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
};
