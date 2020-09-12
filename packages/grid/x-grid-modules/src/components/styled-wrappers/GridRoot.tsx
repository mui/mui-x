import * as React from 'react';
import { classnames } from '../../utils';
import { useStyles } from './GridRootStyles';

type GridRootProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(
  props,
  ref,
) {
  const { className, ...other } = props;
  const classes = useStyles();

  return <div ref={ref} className={classnames(classes.root, className)} {...other} />;
});
