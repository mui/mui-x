import { SvgIconProps } from '@mui/material/SvgIcon';
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridSortDirection } from '../../models/gridSortModel';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(
  props: SvgIconProps,
) {
  const rootProps = useGridRootProps();
  const nextSortDirection: GridSortDirection = props['data-nextsortdirection'];

  const Icon =
    nextSortDirection === 'asc'
      ? rootProps.components.ColumnSortedAscendingIcon
      : rootProps.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
