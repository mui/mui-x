import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
  const apiRef = useGridApiContext();
  const options = useGridSelector(apiRef, optionsSelector);
  const [nextSortDirection] = options.sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? apiRef?.current.components.ColumnSortedAscendingIcon
      : apiRef?.current.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
