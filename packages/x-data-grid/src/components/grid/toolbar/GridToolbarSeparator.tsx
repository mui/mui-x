/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridToolbarRootContext } from './GridToolbarRootContext';

export interface GridToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarSeparator'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Separator = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarSeparator',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  height: 24,
  width: 1,
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.divider,
}));

const DefaultGridToolbarSeparator = React.forwardRef<HTMLDivElement, GridToolbarSeparatorProps>(
  function DefaultGridToolbarSeparator(props, ref) {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const { className, ...other } = props;

    return (
      <Separator
        ref={ref}
        ownerState={rootProps}
        className={clsx(classes.root, className)}
        {...other}
      />
    );
  },
);

DefaultGridToolbarSeparator.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

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
      defaultElement: DefaultGridToolbarSeparator,
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
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarSeparator };
