import * as React from 'react';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { GridLocaleText, GridLocaleTextApi } from '../../models/api/gridLocaleTextApi';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export const useGridLocaleText = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'localeText'>,
): void => {
  const getLocaleText = React.useCallback(
    (key: any): any => {
      if (props.localeText[key as keyof GridLocaleText] == null) {
        throw new Error(`Missing translation for key ${key}.`);
      }
      return props.localeText[key as keyof GridLocaleText];
    },
    [props.localeText],
  );

  const localeTextApi: GridLocaleTextApi = {
    getLocaleText,
  };

  useGridApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
