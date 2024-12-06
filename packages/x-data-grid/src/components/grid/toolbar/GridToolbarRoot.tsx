/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridToolbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
  render?: RenderProp<{}>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarRoot'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledGridToolbarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarRoot',
  overridesResolver: (_, styles) => styles.toolbarRoot,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DefaultGridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledGridToolbarRoot
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
      >
        {children}
      </StyledGridToolbarRoot>
    );
  },
);

DefaultGridToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { render, ...other } = props;

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: DefaultGridToolbarRoot,
      props: {
        ref,
        role: 'toolbar',
        ...other,
      },
    });

    return renderElement();
  },
);

GridToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarRoot };
