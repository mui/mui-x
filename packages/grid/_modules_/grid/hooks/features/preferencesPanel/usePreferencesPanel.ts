import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { PreferencePanelsValue } from './preferencesPanelValue';

export const usePreferencesPanel = (apiRef: ApiRef): void => {
  const logger = useLogger('usePreferencesPanel');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const hideTimeout = React.useRef<any>();

  const hidePreferences = React.useCallback(() => {
    logger.debug('Hiding Preferences Panel');
    setGridState((state) => ({ ...state, preferencePanel: { open: false } }));
    forceUpdate();
  }, [forceUpdate, logger, setGridState]);

  // This is to prevent the preferences from closing when you open a select box or another panel,
  // The issue is in MUI core V4 => Fixed in V5
  const dontHidePanel = React.useCallback(() => {
    setImmediate(() => clearTimeout(hideTimeout.current));
  }, []);

  // This is a hack for the issue with Core V4, by delaying hiding the panel on the clickAwayListener,
  // we can cancel the action if the trigger element still need the panel...
  const hidePreferencesDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(hidePreferences, 100);
  }, [hidePreferences]);

  const showPreferences = React.useCallback(
    (newValue: PreferencePanelsValue) => {
      logger.debug('Opening Preferences Panel');
      dontHidePanel();
      setGridState((state) => ({
        ...state,
        preferencePanel: { ...state.preferencePanel, open: true, openedPanelValue: newValue },
      }));
      forceUpdate();
    },
    [dontHidePanel, forceUpdate, logger, setGridState],
  );

  useApiMethod(
    apiRef,
    {
      showPreferences,
      hidePreferences: hidePreferencesDelayed,
    },
    'ColumnMenuApi',
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(hideTimeout.current);
    };
  }, []);
};
