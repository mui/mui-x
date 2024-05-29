import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';

import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import {
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  gridDimensionsSelector,
  gridVisibleColumnDefinitionsSelector,
  useGridSelector,
} from '../hooks';
import { GridColType, GridEventListener } from '../models';
import { seededRandomNumberGenerator } from '../utils/utils';

const DEFAULT_COLUMN_WIDTH_RANGE = [40, 80] as const;

const COLUMN_WIDTH_RANGE_BY_TYPE: Partial<Record<GridColType, [number, number]>> = {
  number: [40, 60],
  string: [40, 80],
  date: [40, 60],
  dateTime: [60, 80],
  singleSelect: [40, 80],
} as const;

const colWidthVar = (index: number) => `--colWidth-${index}`;

const SkeletonOverlay = styled('div')({
  display: 'grid',
  overflow: 'hidden',
});

const SkeletonCell = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
});

const GridSkeletonLoadingOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridSkeletonLoadingOverlay(props, forwardedRef) {
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

  const children = React.useMemo(() => {
    // reseed random number generator to create stable lines betwen renders
    const array: React.ReactNode[] = [];
    const randomNumberBetween = seededRandomNumberGenerator(12345);

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const column of columns) {
        const [min, max] = column.type
          ? COLUMN_WIDTH_RANGE_BY_TYPE[column.type] ?? DEFAULT_COLUMN_WIDTH_RANGE
          : DEFAULT_COLUMN_WIDTH_RANGE;
        const width = Math.round(randomNumberBetween(min, max));
        const isCircular = column.type === 'boolean' || column.type === 'actions';

        array.push(
          <SkeletonCell
            key={`skeleton-column-${i}-${column.field}`}
            sx={{ justifyContent: column.align }}
          >
            <Skeleton
              width={isCircular ? '1.3em' : `${width}%`}
              height={isCircular ? '1.3em' : '1.2em'}
              variant={isCircular ? 'circular' : 'text'}
              sx={{ mx: 1 }}
            />
          </SkeletonCell>,
        );
      }
      array.push(<SkeletonCell key={`skeleton-filler-column-${i}`} />);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const [initialColWidthVariables, gridTemplateColumns] = columns.reduce(
    ([initialSize, templateColumn], column, i) => {
      const varName = colWidthVar(i);
      initialSize[varName] = `${column.computedWidth}px`;
      templateColumn += ` var(${varName})`;
      return [initialSize, templateColumn];
    },
    [{} as Record<string, string>, ''],
  );

  React.useEffect(() => {
    const handleScrollChange: GridEventListener<'scrollPositionChange'> = (params) => {
      if (ref.current) {
        ref.current.scrollLeft = params.left;
      }
    };
    return apiRef.current.subscribeEvent('scrollPositionChange', handleScrollChange);
  }, [apiRef]);

  React.useEffect(() => {
    const handleScrollChange: GridEventListener<'columnResize'> = (params) => {
      const columnIndex = columns.findIndex((column) => column.field === params.colDef.field);
      ref.current?.style.setProperty(colWidthVar(columnIndex), `${params.width}px`);
    };
    return apiRef.current.subscribeEvent('columnResize', handleScrollChange);
  }, [apiRef, columns]);

  return (
    <SkeletonOverlay
      ref={handleRef}
      {...props}
      style={{
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
