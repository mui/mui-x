import * as React from 'react';
import clsx from 'clsx';
import { useStyles } from './GridRootStyles';
import { GridClassNames } from '../../gridClasses';
import { nameof } from '../../utils/nameof';

export type GridToolbarContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridToolbarContainer = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbarContainer(props, ref) {
    const { className, children, ...other } = props;

    const classes = useStyles(props);

    if (!children) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={clsx(classes[nameof<GridClassNames>('toolbarContainer')], className)}
        {...other}
      >
        {children}
      </div>
    );
  },
);
