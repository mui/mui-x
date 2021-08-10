import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../../gridClasses';

export type GridFooterContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooterContainer = React.forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooterContainer(props: GridFooterContainerProps, ref) {
    const { className, ...other } = props;

    return <div ref={ref} className={clsx(gridClasses.footerContainer, className)} {...other} />;
  },
);
