import * as React from 'react';
import { DivProps } from './grid-root';

export const Window = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={`window ${className || ''}`} {...other} />;
});
Window.displayName = 'Window';
