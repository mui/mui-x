import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';

interface RowCountProps {
  rowCount: number;
  visibleRowCount: number;
}

type GridRowCountProps = React.HTMLAttributes<HTMLDivElement> & RowCountProps;

type OwnerState = { classes: GridComponentProps['classes'] };

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
})(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  margin: theme.spacing(0, 2),
}));

const GridRowCount = React.forwardRef<HTMLDivElement, GridRowCountProps>(function GridRowCount(
  props,
  ref,
) {
  const { className, rowCount, visibleRowCount, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  if (rowCount === 0) {
    return null;
  }

  const text =
    visibleRowCount < rowCount
      ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
      : rowCount.toLocaleString();

  return (
    <GridRowCountRoot ref={ref} className={clsx(classes.root, className)} {...other}>
      {apiRef.current.getLocaleText('footerTotalRows')} {text}
    </GridRowCountRoot>
  );
});

GridRowCount.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  rowCount: PropTypes.number.isRequired,
  visibleRowCount: PropTypes.number.isRequired,
} as any;

export { GridRowCount };
