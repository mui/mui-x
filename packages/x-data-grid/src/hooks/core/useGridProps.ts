'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateCommunity, GridStateProps } from '../../models/gridStateCommunity';
import type { GridStateInitializer } from '../utils/useGridInitializeState';

export const propsStateInitializer: GridStateInitializer<GridStateProps> = (state, props) => {
  return {
    ...state,
    props: {
      listView: props.listView,
      getRowId: props.getRowId,
      isCellEditable: props.isCellEditable,
      isRowSelectable: props.isRowSelectable,
      dataSource: props.dataSource,
    },
  };
};

export const useGridProps = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: RefObject<PrivateApi>,
  props: GridStateProps,
) => {
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.setState((state: GridStateCommunity) => ({
      ...state,
      props: {
        listView: props.listView,
        getRowId: props.getRowId,
        isCellEditable: props.isCellEditable,
        isRowSelectable: props.isRowSelectable,
        dataSource: props.dataSource,
      },
    }));
  }, [
    apiRef,
    props.listView,
    props.getRowId,
    props.isCellEditable,
    props.isRowSelectable,
    props.dataSource,
  ]);
};
