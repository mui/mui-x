import * as React from 'react';
import { DivProps } from './grid-root';
import { classnames } from '../../utils';

export const Window = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={classnames('window', className)} {...other} />;
});
Window.displayName = 'Window';
