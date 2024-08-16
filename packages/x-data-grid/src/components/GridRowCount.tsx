import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { SxProps, Theme } from '@mui/system';
import { styled } from '../utils/styled';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../models/props/DataGridProps';

interface RowCountProps {
  rowCount: number;
  visibleRowCount: number;
}

export type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> &
  RowCountProps & {
    sx?: SxProps<Theme>;
  };

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['rowCount'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRowCountRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'RowCount',
  overridesResolver: (props, styles) => styles.rowCount,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  margin: theme.spacing(0, 2),
}));

const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(
  function GridRowCount(props, ref) {
    const { className, rowCount, visibleRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const ownerState = useGridRootProps();
    const classes = useUtilityClasses(ownerState);

    if (rowCount === 0) {
      return null;
    }

    const text =
      visibleRowCount < rowCount
        ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
        : rowCount.toLocaleString();

    return (
      <GridRowCountRoot
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        {...other}
      >
        {apiRef.current.getLocaleText('footerTotalRows')} {text}
      </GridRowCountRoot>
    );
  },
);

GridRowCount.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  rowCount: PropTypes.number.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  visibleRowCount: PropTypes.number.isRequired,
} as any;

export { GridRowCount };
