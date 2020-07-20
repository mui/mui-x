import * as React from 'react';
import { DivProps } from './grid-root';

export const Footer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={`footer ${className || ''}`} {...other} />;
});
Footer.displayName = 'Footer';
