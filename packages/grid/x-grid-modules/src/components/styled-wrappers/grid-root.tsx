import * as React from 'react';
import { classnames } from '../../utils';
import { useStyles } from './GridRootStyles';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, DivProps>(function GridRoot(props, ref) {
  const { className, ...other } = props;
  const classes = useStyles();

  return <div ref={ref} className={classnames(classes.root, className)} {...other} />;
});
