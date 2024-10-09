import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDimensionsSelector } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';

const useUtilityClasses = () => {
  const slots = {
    root: ['bottomContainer'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

const Element = styled('div')({
  position: 'sticky',
  zIndex: 4,
  bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
});

export function GridBottomContainer(props: React.PropsWithChildren) {
  const classes = useUtilityClasses();

  const apiRef = useGridApiContext();
  const { viewportOuterSize, minimumSize, hasScrollX, scrollbarSize } = useGridSelector(
    apiRef,
    gridDimensionsSelector,
  );
  const scrollHeight = hasScrollX ? scrollbarSize : 0;
  const offset = Math.max(
    viewportOuterSize.height -
      minimumSize.height -
      // Subtract scroll height twice to account for GridVirtualScrollerFiller and horizontal scrollbar
      2 * scrollHeight,
    0,
  );

  return (
    <Element
      {...props}
      className={clsx(classes.root, gridClasses['container--bottom'])}
      style={{ transform: `translateY(${offset}px)` }}
      role="presentation"
    />
  );
}
