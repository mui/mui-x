import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 4px 0',
    },
  },
  { name: 'MuiGridToolbarContainer', defaultTheme },
);

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;
    const classes = useStyles();

    if (!children) {
      return null;
    }

    return (
      <div ref={ref} className={clsx(classes.root, className)} {...other}>
        {children}
      </div>
    );
  },
);
