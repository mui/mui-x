import * as React from 'react';
import { DivProps } from './grid-root';
import { classnames } from '../../utils';

export const Footer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, ...other } = props;
  return <div ref={ref} className={classnames('footer', className)} {...other} />;
});
Footer.displayName = 'Footer';
