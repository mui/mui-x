import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { I18nApi } from '../../../models/api/i18nApi';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { optionsSelector } from '../../utils/useOptionsProp';

export const useI18n = (apiRef: ApiRef): void => {
  const logger = useLogger('useI18n');
  const { localeText } = useGridSelector(apiRef, optionsSelector);

  const getText = React.useCallback(
    (key: any): any => {
      logger.debug(`Get grid text with key ${key}`);

      if (process.env.NODE_ENV !== 'production' && !localeText.hasOwnProperty(key)) {
        throw new Error(`Wrong key used for internal purposes ${key}`);
      }

      return localeText[key];
    },
    [logger, localeText],
  );

  const i18nApi: I18nApi = {
    getText,
  };

  useApiMethod(apiRef, i18nApi, 'I18nApi');
};
