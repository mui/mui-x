import * as React from 'react';
import PropTypes from 'prop-types';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import { GridColumnSortButton, GridColumnSortButtonProps } from '../GridColumnSortButton';

export interface GridColumnHeaderSortIconProps extends GridColumnSortButtonProps {}

function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps) {
  return (
    <GridIconButtonContainer>
      <GridColumnSortButton {...props} tabIndex={-1} />
    </GridIconButtonContainer>
  );
}

const GridColumnHeaderSortIcon = React.memo(GridColumnHeaderSortIconRaw);

GridColumnHeaderSortIconRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  direction: PropTypes.oneOf(['asc', 'desc']),
  field: PropTypes.string.isRequired,
  index: PropTypes.number,
  label: PropTypes.string,
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
} as any;

export { GridColumnHeaderSortIcon };
