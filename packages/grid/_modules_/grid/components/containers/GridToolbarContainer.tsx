import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const GridToolbarContainerRoot = styled('div', {
  name: 'MuiGridToolbarContainer',
  slot: 'Root',
})({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 4px 0',
});

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;

    if (!children) {
      return null;
    }

    return (
      <GridToolbarContainerRoot
        ref={ref}
        className={clsx('MuiGridToolbarContainer-root', className)}
        {...other}
      >
        {children}
      </GridToolbarContainerRoot>
    );
  },
);
