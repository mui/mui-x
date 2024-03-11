import * as React from 'react';
import { styled } from '@mui/system';
import { fastMemo } from '../../utils/fastMemo';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { gridClasses } from '../../constants';

const Filler = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: 'var(--DataGrid-rowWidth)',
  boxSizing: 'border-box',
});

function GridVirtualScrollerFiller() {
  const apiRef = useGridApiContext();
  const { viewportOuterSize, minimumSize, hasScrollX, scrollbarSize } = useGridSelector(
    apiRef,
    gridDimensionsSelector,
  );

  const scrollbarHeight = hasScrollX ? scrollbarSize : 0;
  const expandedHeight = viewportOuterSize.height - minimumSize.height - scrollbarHeight;
  const height = Math.max(scrollbarHeight, expandedHeight);
  if (height === 0) {
    return null;
  }

  return (
    <Filler role="presentation" style={{ height }}>
      <div className={gridClasses.filler} role="presentation" />
    </Filler>
  );
}

const Memoized = fastMemo(GridVirtualScrollerFiller);

export { Memoized as GridVirtualScrollerFiller };
