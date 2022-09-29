import { SvgIconProps } from '@mui/material/SvgIcon';
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridSortDirection } from '../../models/gridSortModel';

interface GridColumnUnsortedIconProps extends SvgIconProps {
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
      ? rootProps.components.ColumnSortedAscendingIcon
      : rootProps.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...other} /> : null;
});
