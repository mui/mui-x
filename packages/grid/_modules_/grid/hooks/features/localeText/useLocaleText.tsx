import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridLocaleTextApi } from '../../../models/api/gridLocaleTextApi';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';

export const useLocaleText = (apiRef: GridApiRef): void => {
  const { localeText } = useGridSelector(apiRef, optionsSelector);
  const getLocaleText = React.useCallback(
    (key: any): any => {
      if (localeText[key] == null) {
        throw new Error(`Missing translation for key ${key}.`);
      }
      return localeText[key];
    },
    [localeText],
  );

  const localeTextApi: GridLocaleTextApi = {
    getLocaleText,
  };

  useGridApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
