import * as React from 'react';
import { useGridColumnHeaders } from '../../_modules_/grid/hooks/features/columnHeaders/useGridColumnHeaders';
import { GridScrollArea } from '../../_modules_/grid/components/GridScrollArea';
import { GridColumnHeaders } from '../../_modules_/grid/components/columnHeaders/GridColumnHeaders';
import { GridColumnHeadersInner } from '../../_modules_/grid/components/columnHeaders/GridColumnHeadersInner';

interface DataGridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: React.Ref<HTMLDivElement>;
}

export const DataGridColumnHeaders = React.forwardRef<HTMLDivElement, DataGridColumnHeadersProps>(
  function GridColumnsHeader(props, ref) {
    const { innerRef, className, ...other } = props;

    const { isDragging, getRootProps, getInnerProps, getColumns } = useGridColumnHeaders({
      innerRef,
    });

    return (
      <GridColumnHeaders ref={ref} {...getRootProps(other)}>
        <GridScrollArea scrollDirection="left" />
        <GridColumnHeadersInner isDragging={isDragging} {...getInnerProps()}>
          {getColumns()}
        </GridColumnHeadersInner>
        <GridScrollArea scrollDirection="right" />
      </GridColumnHeaders>
    );
  },
);
