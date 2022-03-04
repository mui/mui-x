import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridThemeApi } from '../../../models/api/gridThemeApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

export const useGridTheme = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  /**
   * API METHODS
   */
  const setThemePalette = React.useCallback<GridThemeApi['setThemePalette']>(
    (newPalette) => {
      apiRef.current.setState((state) => {
        return { ...state, theme: { palette: newPalette } };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const themeApi: GridThemeApi = {
    setThemePalette,
  };
  useGridApiMethod(apiRef, themeApi, 'GridThemeApi');
};
