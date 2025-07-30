'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateCommunity } from '../../models/gridStateCommunity';
import type { GridStateInitializer } from '../utils/useGridInitializeState';

const PROPS_TO_COPY = [
  'listView',
  'getRowId',
  'columnHeaderHeight',
  'columnGroupHeaderHeight',
  'headerFilterHeight',
] as const;

type Props = Pick<DataGridProcessedProps, (typeof PROPS_TO_COPY)[number]>;

export const propsStateInitializer: GridStateInitializer<Props> = (state, props) => {
  return {
    ...state,
    props: pick(props, PROPS_TO_COPY),
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
  props: Props,
) => {
  React.useEffect(() => {
    apiRef.current.setState((state: GridStateCommunity) => ({
      ...state,
      props: pick(props, PROPS_TO_COPY),
    }));
  }, [apiRef, props.listView, props.getRowId]);
};

// XXX: move to utils
function pick<const T extends readonly string[]>(
  object: Record<string, any>,
  keys: T,
): Pick<Record<string, any>, T[number]> {
  const result = {} as any;
  for (let i = 0; i < keys.length; i += 1) {
    result[keys[i]] = object[keys[i]];
  }
  return result;
}
