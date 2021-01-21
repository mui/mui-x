import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { ApiRef } from '../../../models/api/apiRef';
import { LocaleTextApi } from '../../../models/api/localeTextApi';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';

export const useLocaleText = (apiRef: ApiRef): void => {
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

  const localeTextApi: LocaleTextApi = {
    getLocaleText,
  };

  useApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
