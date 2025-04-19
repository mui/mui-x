import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import { css } from '@mui/x-internals/css';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { composeGridStyles } from '../utils/composeGridStyles';
import { vars } from '../constants/cssVariables';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../models/props/DataGridProps';

interface SelectedRowCountProps {
  selectedRowCount: number;
}

type GridSelectedRowCountProps = React.HTMLAttributes<HTMLDivElement> &
  SelectedRowCountProps & {
    sx?: SxProps<Theme>;
  };

type OwnerState = DataGridProcessedProps;

const GridSelectedRowCountRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'SelectedRowCount',
})<{ ownerState: OwnerState }>(null);

const styles = css('MuiDataGrid-selectedRowCount', {
  root: {
    alignItems: 'center',
    display: 'flex',
    margin: vars.spacing(0, 2),
    visibility: 'hidden',
    width: 0,
    height: 0,
    [vars.breakpoints.up('sm')]: {
      visibility: 'visible',
      width: 'auto',
      height: 'auto',
    },
  },
});

const GridSelectedRowCount = forwardRef<HTMLDivElement, GridSelectedRowCountProps>(
  function GridSelectedRowCount(props, ref) {
    const { className, selectedRowCount, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = composeGridStyles(styles, rootProps.classes);
    const rowSelectedText = apiRef.current.getLocaleText('footerRowSelected')(selectedRowCount);

    return (
      <GridSelectedRowCountRoot
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
        ref={ref}
      >
        {rowSelectedText}
      </GridSelectedRowCountRoot>
    );
  },
);

GridSelectedRowCount.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  selectedRowCount: PropTypes.number.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridSelectedRowCount };
