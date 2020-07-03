import * as React from 'react';
import { DivProps } from './grid-root';

export const Footer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={'footer ' + (className || '')} {...rest}>
      {children}
    </div>
  );
});
Footer.displayName = 'Footer';
