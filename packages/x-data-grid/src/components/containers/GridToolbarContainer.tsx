import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { SxProps, Theme } from '@mui/system';
import { styled } from '../../utils/styled';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridToolbarContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarContainer',
  overridesResolver: (_, styles) => styles.toolbarContainer,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0.5, 0),
}));

const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    if (!children) {
      return null;
    }

    return (
      <GridToolbarContainerRoot
        ref={ref}
        className={clsx(className, classes.root)}
        ownerState={rootProps}
        {...other}
      >
        {children}
      </GridToolbarContainerRoot>
    );
  },
);

GridToolbarContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarContainer };
