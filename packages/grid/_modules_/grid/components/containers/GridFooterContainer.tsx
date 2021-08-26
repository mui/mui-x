import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridFooterContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const GridFooterContainer = React.forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooterContainer(props: GridFooterContainerProps, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();

    return (
      <div
        ref={ref}
        className={clsx(gridClasses.footerContainer, rootProps.classes?.footerContainer, className)}
        {...other}
      />
    );
  },
);
