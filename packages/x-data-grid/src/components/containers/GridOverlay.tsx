import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { Theme, SxProps } from '@mui/system';
import { styled } from '../../utils/styled';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['overlay'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridOverlayRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Overlay',
  overridesResolver: (_, styles) => styles.overlay,
})<{ ownerState: OwnerState }>({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--unstable_DataGrid-overlayBackground)',
});

const GridOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(function GridOverlay(
  props: GridOverlayProps,
  ref,
) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <GridOverlayRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={rootProps}
      {...other}
    />
  );
});

GridOverlay.propTypes = {
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

export { GridOverlay };
