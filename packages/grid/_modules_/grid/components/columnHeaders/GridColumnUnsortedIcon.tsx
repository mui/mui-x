import * as React from 'react';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const [nextSortDirection] = rootProps.sortingOrder!;

  const Icon =
    nextSortDirection === 'asc'
      ? apiRef?.current.components.ColumnSortedAscendingIcon
      : apiRef?.current.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
