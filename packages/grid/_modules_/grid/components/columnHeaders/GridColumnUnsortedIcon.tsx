import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
  const rootProps = useGridRootProps();
  const [nextSortDirection] = rootProps.sortingOrder!;

  const Icon =
    nextSortDirection === 'asc'
      ? rootProps.components.ColumnSortedAscendingIcon
      : rootProps.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
