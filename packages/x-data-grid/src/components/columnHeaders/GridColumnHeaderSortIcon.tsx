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
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  direction: PropTypes.oneOf(['asc', 'desc']),
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['end', 'start', false]),
  field: PropTypes.string.isRequired,
  id: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { GridColumnHeaderSortIcon };
