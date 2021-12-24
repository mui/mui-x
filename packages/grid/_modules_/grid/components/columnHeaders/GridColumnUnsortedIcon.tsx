import { SvgIconProps } from '@mui/material/SvgIcon';
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(
  props: SvgIconProps,
) {
  const rootProps = useGridRootProps();
  const nextSortDirection = props['aria-sort'];

  const Icon =
    nextSortDirection === 'ascending'
      ? rootProps.components.ColumnSortedAscendingIcon
      : rootProps.components.ColumnSortedDescendingIcon;

  return Icon ? <Icon {...props} /> : null;
});
