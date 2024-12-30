import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled, SxProps, Theme } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type GridFooterContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  sx?: SxProps<Theme>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['footerContainer', 'withBorderColor'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridFooterContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FooterContainer',
  overridesResolver: (props, styles) => styles.footerContainer,
})<{ ownerState: OwnerState }>({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: 52,
  borderTop: '1px solid',
});

const GridFooterContainer = forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooterContainer(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <GridFooterContainerRoot
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
        ref={ref}
      />
    );
  },
);

GridFooterContainer.propTypes = {
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

export { GridFooterContainer };
