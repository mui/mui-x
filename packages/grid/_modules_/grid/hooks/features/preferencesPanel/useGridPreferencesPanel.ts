import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import { GridPreferencePanelsValue } from './gridPreferencePanelsValue';
import { useGridStateInit } from '../../utils/useGridStateInit';

export const useGridPreferencesPanel = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridPreferencesPanel');

  useGridStateInit(apiRef, (state) => ({ ...state, preferencePanel: { open: false } }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const hideTimeout = React.useRef<any>();
  const immediateTimeout = React.useRef<any>();

  const hidePreferences = React.useCallback(() => {
    logger.debug('Hiding Preferences Panel');
    setGridState((state) => ({ ...state, preferencePanel: { open: false } }));
    forceUpdate();
  }, [forceUpdate, logger, setGridState]);

  // This is to prevent the preferences from closing when you open a select box or another panel,
  // The issue is in MUI core V4 => Fixed in V5
  const doNotHidePanel = React.useCallback(() => {
    immediateTimeout.current = setTimeout(() => clearTimeout(hideTimeout.current), 0);
  }, []);

  // This is a hack for the issue with Core V4, by delaying hiding the panel on the clickAwayListener,
  // we can cancel the action if the trigger element still need the panel...
  const hidePreferencesDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(hidePreferences, 100);
  }, [hidePreferences]);

  const showPreferences = React.useCallback(
    (newValue: GridPreferencePanelsValue) => {
      logger.debug('Opening Preferences Panel');
      doNotHidePanel();
      setGridState((state) => ({
        ...state,
        preferencePanel: { ...state.preferencePanel, open: true, openedPanelValue: newValue },
      }));
      forceUpdate();
    },
    [doNotHidePanel, forceUpdate, logger, setGridState],
  );

  useGridApiMethod(
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
      clearTimeout(immediateTimeout.current);
    };
  }, []);
};
