import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { SizeApi } from '../../../models/api/sizeApi';
import { Size, SizeTypes } from '../../../models';
import { optionsSelector } from '../../utils/useOptionsProp';
import { SizeState } from './sizeState';

export const SIZE_FACTOR_SMALL = 0.7;
export const SIZE_FACTOR_LARGE = 1.3;

export const useSize = (apiRef: ApiRef): void => {
  const logger = useLogger('useSize');
  const { rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const getUpdatedSizeState = React.useCallback(
    (size: Size, newHeaderHeight: number, newRowHeight: number): SizeState => {
      switch (size) {
        case SizeTypes.Small:
          return {
            value: size,
            headerHeight: Math.floor(newHeaderHeight * SIZE_FACTOR_SMALL),
            rowHeight: Math.floor(newRowHeight * SIZE_FACTOR_SMALL),
          };
        case SizeTypes.Large:
          return {
            value: size,
            headerHeight: Math.floor(newHeaderHeight * SIZE_FACTOR_LARGE),
            rowHeight: Math.floor(newRowHeight * SIZE_FACTOR_LARGE),
          };
        default:
          return {
            value: size,
            headerHeight: newHeaderHeight,
            rowHeight: newRowHeight,
          };
      }
    },
    [],
  );

  const setSize = React.useCallback(
    (size: Size, newHeaderHeight = headerHeight, newRowHeight = rowHeight): void => {
      logger.debug(`Set grid size to ${size}`);
      setGridState((oldState) => ({
        ...oldState,
        size: {
          ...oldState.size,
          ...getUpdatedSizeState(size, newHeaderHeight, newRowHeight),
        },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, getUpdatedSizeState, headerHeight, rowHeight],
  );

  const sizeApi: SizeApi = {
    setSize,
  };

  useApiMethod(apiRef, sizeApi, 'SizeApi');
};
