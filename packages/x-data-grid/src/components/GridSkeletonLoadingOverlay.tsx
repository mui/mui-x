import * as React from 'react';
import { styled } from '@mui/system';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  gridDimensionsSelector,
  gridVisibleColumnDefinitionsSelector,
  useGridApiEventHandler,
  useGridSelector,
} from '../hooks';
import { GridEventListener } from '../models';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../constants/gridClasses';

const colWidthVar = (index: number) => `--colWidth-${index}`;

const SkeletonOverlay = styled('div', {
  name: 'MuiDataGrid',
  slot: 'SkeletonLoadingOverlay',
  overridesResolver: (props, styles) => styles.skeletonLoadingOverlay,
})({
  display: 'grid',
  width: 'max-content', // ensures overflow: hidden; does not cut off the x axis
  minWidth: '100%', // ensures the filler column takes up the remaining space in a row
  height: '100%',
  overflow: 'hidden',
  '& .MuiDataGrid-cellSkeleton': {
    borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
  },
});

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['skeletonLoadingOverlay'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridSkeletonLoadingOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridSkeletonLoadingOverlay(props, forwardedRef) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses({ ...props, classes: rootProps.classes });
  const ref = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, forwardedRef);

  const apiRef = useGridApiContext();

  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const skeletonRowsCount = Math.ceil(viewportHeight / dimensions.rowHeight);

  const totalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const positions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const inViewportCount = React.useMemo(
    () => positions.filter((value) => value <= totalWidth).length,
    [totalWidth, positions],
  );
  const allVisibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const columns = allVisibleColumns.slice(0, inViewportCount);

  const { slots } = rootProps;
  const children = React.useMemo(() => {
    const array: React.ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const column of columns) {
        array.push(
          <slots.skeletonCell
            key={`skeleton-column-${i}-${column.field}`}
            type={column.type}
            align={column.align}
          />,
        );
      }
      array.push(<slots.skeletonCell key={`skeleton-filler-column-${i}`} empty />);
    }
    return array;
  }, [skeletonRowsCount, columns, slots]);

  const [initialColWidthVariables, gridTemplateColumns] = columns.reduce(
    ([initialSize, templateColumn], column, i) => {
      const varName = colWidthVar(i);
      initialSize[varName] = `${column.computedWidth}px`;
      templateColumn += ` var(${varName})`;
      return [initialSize, templateColumn];
    },
    [{} as Record<string, string>, ''],
  );

  // Sync the column resize of the overlay columns with the grid
  const handleColumnResize: GridEventListener<'columnResize'> = (params) => {
    const columnIndex = columns.findIndex((column) => column.field === params.colDef.field);
    ref.current?.style.setProperty(colWidthVar(columnIndex), `${params.width}px`);
  };
  useGridApiEventHandler(apiRef, 'columnResize', handleColumnResize);

  return (
    <SkeletonOverlay
      className={classes.root}
      ref={handleRef}
      {...props}
      style={{
        // the filler column is set to `1fr` to take up the remaining space in a row
        gridTemplateColumns: `${gridTemplateColumns} 1fr`,
        gridAutoRows: dimensions.rowHeight,
        ...initialColWidthVariables,
        ...props.style,
      }}
    >
      {children}
    </SkeletonOverlay>
  );
});

export { GridSkeletonLoadingOverlay };
