import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import { css } from '@mui/x-internals/css';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../constants/cssVariables';
import { composeGridStyles } from '../utils/composeGridStyles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
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

const GridRowCountRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'RowCount',
  overridesResolver: (props, styles) => styles.rowCount,
})<{ ownerState: OwnerState }>(null);

const styles = css('MuiDataGrid-rowCount', {
  root: {
    alignItems: 'center',
    display: 'flex',
    margin: vars.spacing(0, 2),
  },
});

const GridRowCount = forwardRef<HTMLDivElement, GridRowCountProps>(
  function GridRowCount(props, ref) {
    const { className, rowCount, visibleRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = composeGridStyles(styles, rootProps.classes);

    if (rowCount === 0) {
      return null;
    }

    const text =
      visibleRowCount < rowCount
        ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
        : rowCount.toLocaleString();

    return (
      <GridRowCountRoot
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
        ref={ref}
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
