import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { LocaleTextApi } from '../../../models/api/localeTextApi';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { optionsSelector } from '../../utils/useOptionsProp';

export const useLocaleText = (apiRef: ApiRef): void => {
  const logger = useLogger('useLocaleText');
  const { localeText } = useGridSelector(apiRef, optionsSelector);

  const getLocaleText = React.useCallback(
    (key: any): any => {
      logger.debug(`Get grid text with key ${key}`);

      return localeText[key];
    },
    [logger, localeText],
  );

  const localeTextApi: LocaleTextApi = {
    getLocaleText,
  };

  useApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
