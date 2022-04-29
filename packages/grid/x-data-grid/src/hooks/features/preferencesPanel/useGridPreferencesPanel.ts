import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { gridPreferencePanelStateSelector } from './gridPreferencePanelSelector';
import { GridPreferencesPanelApi } from '../../../models/api/gridPreferencesPanelApi';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridSelector } from '../../utils/useGridSelector';

export const preferencePanelStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'initialState'>
> = (state, props) => ({
  ...state,
  preferencePanel: props.initialState?.preferencePanel ?? { open: false },
});

/**
 * TODO: Add a single `setPreferencePanel` method to avoid multiple `setState`
 */
export const useGridPreferencesPanel = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  const logger = useGridLogger(apiRef, 'useGridPreferencesPanel');

  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const hideTimeout = React.useRef<any>();
  const immediateTimeout = React.useRef<any>();

  /**
   * API METHODS
   */
  const hidePreferences = React.useCallback(() => {
    logger.debug('Hiding Preferences Panel');
    if (preferencePanelState.openedPanelValue) {
      apiRef.current.publishEvent('preferencePanelClose', {
        openedPanelValue: preferencePanelState.openedPanelValue,
      });
    }
    apiRef.current.setState((state) => ({ ...state, preferencePanel: { open: false } }));
    apiRef.current.forceUpdate();
  }, [apiRef, logger, preferencePanelState.openedPanelValue]);

  // This is to prevent the preferences from closing when you open a select box or another panel,
  // The issue is in MUI core V4 => Fixed in V5
  const doNotHidePanel = React.useCallback(() => {
    immediateTimeout.current = setTimeout(() => clearTimeout(hideTimeout.current), 0);
  }, []);

  // This is a hack for the issue with Core V4, by delaying hiding the panel on the clickAwayListener,
  // we can cancel the action if the trigger element still need the panel...
  const hidePreferencesDelayed = React.useCallback<
    GridPreferencesPanelApi['hidePreferences']
  >(() => {
    hideTimeout.current = setTimeout(hidePreferences, 100);
  }, [hidePreferences]);

  const showPreferences = React.useCallback<GridPreferencesPanelApi['showPreferences']>(
    (newValue) => {
      logger.debug('Opening Preferences Panel');
      doNotHidePanel();
      apiRef.current.setState((state) => ({
        ...state,
        preferencePanel: { ...state.preferencePanel, open: true, openedPanelValue: newValue },
      }));
      apiRef.current.publishEvent('preferencePanelOpen', {
        openedPanelValue: newValue,
      });
      apiRef.current.forceUpdate();
    },
    [logger, doNotHidePanel, apiRef],
  );

  useGridApiMethod(
    apiRef,
    {
      showPreferences,
      hidePreferences: hidePreferencesDelayed,
    },
    'ColumnMenuApi',
  );

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      const preferencePanelToExport = gridPreferencePanelStateSelector(apiRef.current.state);
      if (!preferencePanelToExport.open && !preferencePanelToExport.openedPanelValue) {
        return prevState;
      }

      return {
        ...prevState,
        preferencePanel: preferencePanelToExport,
      };
    },
    [apiRef],
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

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    return () => {
      clearTimeout(hideTimeout.current);
      clearTimeout(immediateTimeout.current);
    };
  }, []);
};
