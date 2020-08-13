import * as React from 'react';
import { DivProps } from './grid-root';
import { classnames } from '../../utils';

export const ColumnsContainer = React.forwardRef<HTMLDivElement, DivProps & { height: number }>(
  (props, ref) => {
    const { className, height, ...other } = props;
    return (
      <div
        ref={ref}
        className={classnames('columns-container', className)}
        {...other}
        style={{ minHeight: height, maxHeight: height, lineHeight: `${height}px` }}
      />
    );
  },
);
ColumnsContainer.displayName = 'ColumnsContainer';
