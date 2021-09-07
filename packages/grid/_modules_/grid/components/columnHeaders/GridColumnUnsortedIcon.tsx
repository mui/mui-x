import * as React from 'react';
import { useGridRootProps } from '../../hooks/root/useGridRootProps';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
  const rootProps = useGridRootProps();
  const [nextSortDirection] = rootProps.sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? rootProps.components.ColumnSortedAscendingIcon
      : rootProps.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
