import * as React from 'react';
import { GridOptions } from '../../models';
import { classnames } from '../../utils';
import { getStyles } from './getStyles';
import {ROOT_CSS_CLASS} from "../../constants";

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export interface GridRootProps {
  options: GridOptions;
}
export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps & DivProps>((props, ref) => {
  const { options, className, ...other } = props;
  const styles = getStyles();

  return (
    <div ref={ref} className={classnames(styles[ROOT_CSS_CLASS], className, ROOT_CSS_CLASS)} {...other} />
  );
});
GridRoot.displayName = 'GridRoot';
