import * as React from 'react';
import { DivProps } from './grid-root';
import { classnames } from '../../utils';

export const ColumnsContainer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={classnames('columns-container', className)} {...other} />;
});
ColumnsContainer.displayName = 'ColumnsContainer';
