import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridBaseIconProps } from '../models/gridSlotsComponentsProps';
import { GridSortDirection } from '../models/gridSortModel';

interface GridColumnUnsortedIconProps extends GridBaseIconProps {
  sortingOrder: GridSortDirection[];
}

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnUnsortedIconProps,
) {
  const { sortingOrder, ...other } = props;
  const rootProps = useGridRootProps();
  const [nextSortDirection] = sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? rootProps.slots.columnSortedAscendingIcon
      : rootProps.slots.columnSortedDescendingIcon;

  return Icon ? <Icon {...other} /> : null;
});
