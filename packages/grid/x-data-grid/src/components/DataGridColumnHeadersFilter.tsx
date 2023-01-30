import * as React from 'react';
import { useGridColumnHeadersFilter } from '../hooks/features/columnHeaders/useGridColumnHeadersFilter';
import { GridColumnHeaders } from './columnHeaders/GridColumnHeaders';
import { GridColumnHeadersInner } from './columnHeaders/GridColumnHeadersInner';

interface DataGridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: React.Ref<HTMLDivElement>;
}

export const DataGridColumnHeadersFilter = React.forwardRef<
  HTMLDivElement,
  DataGridColumnHeadersProps
>(function DataGridColumnHeadersFilter(props, ref) {
  const { innerRef, className, ...other } = props;

  const { getRootProps, getInnerProps, getColumnFilters } = useGridColumnHeadersFilter({
    innerRef,
  });

  return (
    <GridColumnHeaders ref={ref} {...getRootProps(other)}>
      <GridColumnHeadersInner isDragging={false} {...getInnerProps()}>
        {getColumnFilters()}
      </GridColumnHeadersInner>
    </GridColumnHeaders>
  );
});
