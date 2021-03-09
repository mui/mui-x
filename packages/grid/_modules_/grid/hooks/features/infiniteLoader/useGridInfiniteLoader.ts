import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';

export const useGridInfiniteLoader = (apiRef: GridApiRef): void => {
  const options = useGridSelector(apiRef, optionsSelector);

  console.log(apiRef.current)
  console.log(options)

  const test = {

  };

  // useGridApiMethod(apiRef, localeTextApi, 'LocaleTextApi');
};
