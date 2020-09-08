import * as React from 'react';
import { GridOptions } from '../../models';
import { classnames } from '../../utils';
import { useStyles } from './useStyles';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export interface GridRootProps {
  options: GridOptions;
}
export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps & DivProps>((props, ref) => {
  const { options, className, ...other } = props;
  const classes = useStyles();

  return (
    <div
      ref={ref}
      className={classnames(classes.root, className)}
      {...other}
    />
  );
});
GridRoot.displayName = 'GridRoot';
