/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridToolbarRootContext } from './GridToolbarRootContext';

export interface GridToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
}

/**
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [GridToolbarSeparator API](https://mui.com/x/api/data-grid/grid-toolbar-separator/)
 */
const GridToolbarSeparator = React.forwardRef<HTMLDivElement, GridToolbarSeparatorProps>(
  function GridToolbarSeparator(props, ref) {
    const { render, ...other } = props;
    const { orientation } = useGridToolbarRootContext();

    return useGridComponentRenderer({
      render,
      defaultElement: 'div',
      props: {
        ref,
        role: 'separator',
        'aria-orientation': orientation === 'horizontal' ? 'vertical' : 'vertical',
        ...other,
      },
    });
  },
);

GridToolbarSeparator.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarSeparator };
