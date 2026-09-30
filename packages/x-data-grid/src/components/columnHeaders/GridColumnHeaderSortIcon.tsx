import * as React from 'react';
import PropTypes from 'prop-types';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import { GridColumnSortButton } from '../GridColumnSortButton';
import type { GridColumnSortButtonProps } from '../GridColumnSortButton';

export interface GridColumnHeaderSortIconProps extends GridColumnSortButtonProps {}

function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps) {
  return (
    <GridIconButtonContainer>
      <GridColumnSortButton {...props} tabIndex={-1} />
    </GridIconButtonContainer>
  );
}

const GridColumnHeaderSortIcon = React.memo(GridColumnHeaderSortIconRaw);

GridColumnHeaderSortIconRaw.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  /**
   * The component used for the root node. Either a string to use an HTML element or a component.
   */
  component: PropTypes.elementType,
  direction: PropTypes.oneOf(['asc', 'desc']),
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['end', 'start', false]),
  field: PropTypes.string.isRequired,
  /**
   * The URL to link to. If set, and `component` is not set, the component renders as an anchor tag.
   */
  href: PropTypes.string,
  id: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  /**
   * The relationship of the linked URL.
   * Set it to `noopener noreferrer` when `target` is set to `_blank` to avoid a security issue.
   */
  rel: PropTypes.string,
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target: PropTypes.string,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { GridColumnHeaderSortIcon };
