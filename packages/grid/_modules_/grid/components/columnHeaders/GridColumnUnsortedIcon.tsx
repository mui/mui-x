import * as React from 'react';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(props) {
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const [nextSortDirection] = options.sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? apiRef?.current.components.ColumnSortedAscendingIcon
      : apiRef?.current.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
