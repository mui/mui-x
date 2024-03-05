import * as React from 'react';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateInitializer } from '../utils/useGridInitializeState';

export const propsStateInitializer: GridStateInitializer<DataGridProcessedProps> = (
  state,
  props,
) => {
  return {
    ...state,
    props: {
      isRowSelectable: props.isRowSelectable,
    },
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: React.MutableRefObject<PrivateApi>,
  props: DataGridProcessedProps,
) => {
  React.useEffect(() => {
    apiRef.current.setState((state) => ({
      ...state,
      props: {
        isRowSelectable: props.isRowSelectable,
      },
    }));
  }, [apiRef, props.isRowSelectable]);
};
