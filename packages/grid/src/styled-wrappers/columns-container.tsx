import React from 'react';
import { DivProps } from './grid-root';

export const ColumnsContainer = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={'columns-container ' + (className || '')} {...rest}>
      {children}
    </div>
  );
});
ColumnsContainer.displayName = 'ColumnsContainer';
