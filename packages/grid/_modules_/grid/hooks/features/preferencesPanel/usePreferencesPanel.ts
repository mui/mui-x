import * as React from 'react';
import { PREVENT_HIDE_PREFERENCES } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { PreferencePanelsValue } from './preferencesPanelValue';

export const usePreferencesPanel = (apiRef: ApiRef): void => {
  const logger = useLogger('usePreferencesPanel');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const hideTimeout = React.useRef<any>();

  const showPreferences = React.useCallback(
    (newValue: PreferencePanelsValue) => {
      logger.debug('Opening Preferences Panel');
      setGridState((state) => ({
        ...state,
        preferencePanel: { ...state.preferencePanel, open: true, openedPanelValue: newValue },
      }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const hidePreferences = React.useCallback(() => {
    logger.debug('Hiding Preferences Panel');
    setGridState((state) => ({ ...state, preferencePanel: { open: false } }));
    forceUpdate();
  }, [forceUpdate, logger, setGridState]);

  const hidePreferencesDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(hidePreferences, 100);
  }, [hidePreferences]);

  // This is to prevent the preferences from closing when you open a select box, issue with MUI core V4 => Fixed in V5
  const dontHidePanel = React.useCallback(() => {
    setImmediate(() => clearTimeout(hideTimeout.current));
  }, []);

  useApiMethod(
    apiRef,
    {
      showPreferences,
      hidePreferences: hidePreferencesDelayed,
    },
    'ColumnMenuApi',
  );

  useApiEventHandler(apiRef!, PREVENT_HIDE_PREFERENCES, dontHidePanel);
};
