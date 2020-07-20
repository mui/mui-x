import * as React from 'react';
import { DivProps } from './grid-root';

export const DataContainer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={`data-container ${className || ''}`} {...other} />;
});
DataContainer.displayName = 'DataContainer';
