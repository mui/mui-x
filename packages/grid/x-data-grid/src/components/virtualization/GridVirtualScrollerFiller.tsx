import * as React from 'react';
import { styled } from '@mui/system';
import { fastMemo } from '../../utils/fastMemo';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { gridClasses } from '../../constants/gridClasses';

const Filler = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: 'var(--DataGrid-rowWidth)',
  boxSizing: 'border-box',
  // backgroundColor: 'rgb(255 0 0 / 0.2)',
})

const Pinned = styled('div')({
  position: 'sticky',
  height: '100%',
  boxSizing: 'border-box',
  borderTop: '1px solid var(--DataGrid-rowBorderColor)',
  backgroundColor: 'var(--DataGrid-pinnedBackground)',
})
const PinnedLeft = styled(Pinned)({
  left: 0,
  [`.${gridClasses.withVerticalBorder}`]: {
    borderRight: '1px solid var(--DataGrid-rowBorderColor)',
  },
})
const PinnedRight = styled(Pinned)({
  right: 0,
  [`.${gridClasses.withVerticalBorder}`]: {
    borderLeft: '1px solid var(--DataGrid-rowBorderColor)',
  },
})

const Main = styled('div')({
  flexGrow: 1,
  borderTop: '1px solid var(--DataGrid-rowBorderColor)',
})

function GridVirtualScrollerFiller() {
  const apiRef = useGridApiContext();
  const {
    viewportOuterSize,
    minimumSize,
    hasScrollX,
    scrollbarSize,
    leftPinnedWidth,
    rightPinnedWidth,
  } = useGridSelector(apiRef, gridDimensionsSelector);

  const unknownGap = 2;

  const height = Math.max(0,
    viewportOuterSize.height - minimumSize.height - (hasScrollX ? scrollbarSize : 0) - unknownGap);

  return (
    <Filler role="presentation" style={{ height, display: height === 0 ? 'none' : undefined }}>
      <PinnedLeft style={{ width: leftPinnedWidth }}/>
      <Main />
      <PinnedRight style={{ width: rightPinnedWidth }}/>
    </Filler>
  );
}

const Memoized = fastMemo(GridVirtualScrollerFiller)

export {
  Memoized as GridVirtualScrollerFiller
};
