import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import {
  gridClasses,
  getDataGridUtilityClass,
  useGridSelector,
  gridRowsLoadingSelector,
  gridRowTreeSelector,
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
} from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridAggregationRowOverlay } from './GridAggregationRowOverlay';
import { useGridRootProps } from '../typeOverloads/reexports';
import { gridAggregationModelSelector } from '../hooks';

const useUtilityClasses = () => {
  const slots = {
    root: ['bottomContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

export type GridBottomContainerProps = React.PropsWithChildren;

const Element = styled('div')({
  position: 'sticky',
  zIndex: 40,
  bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
});

export function GridBottomContainer(props: GridBottomContainerProps) {
  const classes = useUtilityClasses();
  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const isLoading = useGridSelector(apiRef, gridRowsLoadingSelector);
  const tree = useGridSelector(apiRef, gridRowTreeSelector);
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const aggregationPosition = rootProps.getAggregationPosition(
    tree[GRID_ROOT_GROUP_ID] as GridGroupNode,
  );
  const hasAggregation = React.useMemo(
    () => Object.keys(aggregationModel).length > 0,
    [aggregationModel],
  );

  const { children, ...other } = props;

  return (
    <Element
      {...other}
      className={clsx(classes.root, gridClasses['container--bottom'])}
      role="presentation"
    >
      {hasAggregation && isLoading && aggregationPosition === 'footer' ? (
        <GridAggregationRowOverlay />
      ) : (
        children
      )}
    </Element>
  );
}
