import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { GridBaseIconProps } from '../models/gridSlotsComponentsProps';
import type { GridSortDirection } from '../models/gridSortModel';

export interface GridColumnUnsortedIconProps extends GridBaseIconProps {
  sortingOrder: GridSortDirection[];
}

function GridColumnUnsortedIcon(props: GridColumnUnsortedIconProps) {
  const { sortingOrder, ...other } = props;
  const { slots } = useGridRootProps();
  const [nextSortDirection] = sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? slots.columnSortedAscendingIcon
      : slots.columnSortedDescendingIcon;

  return Icon ? <Icon {...other} /> : null;
}

GridColumnUnsortedIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

export { GridColumnUnsortedIcon };
