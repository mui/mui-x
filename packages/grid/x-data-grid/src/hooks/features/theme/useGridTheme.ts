import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridThemeApi } from '../../../models/api/gridThemeApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

export const useGridTheme = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  /**
   * API METHODS
   */
  const setThemeMode = React.useCallback<GridThemeApi['setThemeMode']>(
    (newMode) => {
      apiRef.current.setState((state) => {
        return { ...state, theme: { palette: { mode: newMode } } };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const themeApi: GridThemeApi = {
    setThemeMode,
  };
  useGridApiMethod(apiRef, themeApi, 'GridThemeApi');
};
