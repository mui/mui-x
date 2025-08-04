'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateCommunity } from '../../models/gridStateCommunity';
import type { GridStateInitializer } from '../utils/useGridInitializeState';

type Props = Pick<DataGridProcessedProps, 'getRowId' | 'listView'>;

export const propsStateInitializer: GridStateInitializer<Props> = (state, props) => {
  return {
    ...state,
    props: {
      listView: props.listView,
      getRowId: props.getRowId,
    },
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
  props: Props,
) => {
  React.useEffect(() => {
    apiRef.current.setState((state: GridStateCommunity) => ({
      ...state,
      props: {
        listView: props.listView,
        getRowId: props.getRowId,
      },
    }));
  }, [apiRef, props.listView, props.getRowId]);
};
