import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import { GridColumnSortButton } from '../GridColumnSortButton';
import type { GridColumnSortButtonProps } from '../GridColumnSortButton';

export interface GridColumnHeaderSortIconProps extends Omit<
  GridColumnSortButtonProps,
  'columnName'
> {
  columnName?: string;
}

function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps) {
  const { field, columnName = field, onClick, ...other } = props;
  const apiRef = useGridApiContext();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.setColumnHeaderFocus(field, event);
      onClick?.(event);
    },
    [apiRef, field, onClick],
  );

  return (
    <GridIconButtonContainer>
      <GridColumnSortButton
        {...other}
        field={field}
        columnName={columnName}
        tabIndex={-1}
        onClick={handleClick}
      />
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
  /**
   * The color of the button.
   */
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  columnName: PropTypes.string,
  /**
   * The component used for the root node. Either a string to use an HTML element or a component.
   */
  component: PropTypes.elementType,
  direction: PropTypes.oneOf(['asc', 'desc']),
  /**
   * If `true`, the button is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If given, uses a negative margin to align the button with the edge of its container.
   */
  edge: PropTypes.oneOf(['end', 'start', false]),
  field: PropTypes.string.isRequired,
  /**
   * The URL to link to. If set, and `component` is not set, the component renders as an anchor tag.
   */
  href: PropTypes.string,
  /**
   * The id of the button element.
   */
  id: PropTypes.string,
  index: PropTypes.number,
  /**
   * The label of the button.
   */
  label: PropTypes.string,
  /**
   * The relationship of the linked URL.
   * Set it to `noopener noreferrer` when `target` is set to `_blank` to avoid a security issue.
   */
  rel: PropTypes.string,
  /**
   * The ARIA role of the button element.
   */
  role: PropTypes.string,
  /**
   * The size of the button.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
  style: PropTypes.object,
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex: PropTypes.number,
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target: PropTypes.string,
  /**
   * The title of the button element.
   */
  title: PropTypes.string,
  /**
   * @ignore
   */
  touchRippleRef: PropTypes.any,
} as any;

export { GridColumnHeaderSortIcon };
