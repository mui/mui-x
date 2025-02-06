import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { DataGridProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateInitializer } from '../utils/useGridInitializeState';
import type { GridStateCommunity } from '../../models/gridStateCommunity';

type Props = Pick<DataGridProps, 'getRowId'>;

export const gridPropsStateSelector = (state: GridStateCommunity) => state.props;

export const propsStateInitializer: GridStateInitializer<Props> = (state, props) => {
  return {
    ...state,
    props: {
      getRowId: props.getRowId,
    },
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
  props: Props,
) => {
  React.useEffect(() => {
    apiRef.current.setState((state) => ({
      ...state,
      props: {
        getRowId: props.getRowId,
      },
    }));
  }, [apiRef, props.getRowId]);
};
