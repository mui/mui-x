import * as React from 'react';
import { classnames } from '../../utils';
import { useStyles } from './useStyles';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const GridRoot = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  const classes = useStyles();

  return <div ref={ref} className={classnames(classes.root, className)} {...other} />;
});

GridRoot.displayName = 'GridRoot';
