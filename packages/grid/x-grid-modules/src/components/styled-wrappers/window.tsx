import * as React from 'react';
import { DivProps } from './grid-root';

export const Window = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={'window ' + (className || '')} {...rest}>
      {children}
    </div>
  );
});
Window.displayName = 'Window';
