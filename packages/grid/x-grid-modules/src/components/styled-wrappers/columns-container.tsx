import * as React from 'react';
import { DivProps } from './grid-root';

export const ColumnsContainer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={`columns-container ${className || ''}`} {...other} />;
});
ColumnsContainer.displayName = 'ColumnsContainer';
