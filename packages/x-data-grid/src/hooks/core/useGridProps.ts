import * as React from 'react';
import type { DataGridProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateInitializer } from '../utils/useGridInitializeState';

export const propsStateInitializer: GridStateInitializer<Pick<DataGridProps, 'rowCount'>> = (
  state,
  props,
) => {
  return {
    ...state,
    props: {
      rowCount: props.rowCount,
    },
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: React.MutableRefObject<PrivateApi>,
  props: DataGridProps,
) => {
  React.useEffect(() => {
    apiRef.current.setState((state) => ({
      ...state,
      props: {
        rowCount: props.rowCount,
      },
    }));
  }, [apiRef, props.rowCount]);
};
