import * as React from 'react';
import clsx from 'clsx';

export type GridFooterContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooterContainer = React.forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooterContainer(props: GridFooterContainerProps, ref) {
    const { className, ...other } = props;

    return <div ref={ref} className={clsx('MuiGridFooterContainer', className)} {...other} />;
  },
);
