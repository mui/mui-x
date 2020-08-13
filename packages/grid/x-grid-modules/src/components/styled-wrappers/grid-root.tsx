import * as React from 'react';
import { GridOptions } from '../../models';
import { classnames } from '../../utils';
import styles from './styles.module.css';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export interface GridRootProps {
  options: GridOptions;
}

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps & DivProps>((props, ref) => {
  const { options, className, ...other } = props;

  return (
    <div ref={ref} className={classnames(styles.gridRoot || 'gridRoot', className)} {...other} />
  );
});
GridRoot.displayName = 'GridRoot';
