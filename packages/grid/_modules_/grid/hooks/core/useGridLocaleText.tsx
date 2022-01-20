import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridLocaleTextApi } from '../../models/api/gridLocaleTextApi';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export const useGridLocaleText = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'localeText'>,
): void => {
  const getLocaleText = React.useCallback(
    (key: any): any => {
      if (props.localeText[key] == null) {
        throw new Error(`Missing translation for key ${key}.`);
      }
      return props.localeText[key];
    },
    [props.localeText],
  );

  const localeTextApi: GridLocaleTextApi = {
    getLocaleText,
  };

  useGridApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
