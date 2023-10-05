import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import {
  GridPinnedRowsProps,
  gridPinnedRowsSelector,
  useGridPrivateApiContext,
} from '@mui/x-data-grid/internals';

const useUtilityClasses = () => {
  const slots = {
    root: ['pinnedRows'],
  };
  return composeClasses(slots, getDataGridUtilityClass, {});
};

const Element = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedRows',
  overridesResolver: (_props, styles) => styles.pinnedRows ?? {},
})({});

export function GridPinnedRows({ position, virtualScroller, ...other }: GridPinnedRowsProps) {
  const classes = useUtilityClasses();
  const apiRef = useGridPrivateApiContext();

  const mainRowsLength =
    virtualScroller.renderContext.lastRowIndex - virtualScroller.renderContext.firstRowIndex;

  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedRows = virtualScroller.getRows({
    rows: pinnedRowsData[position],
    rowIndexOffset: position === 'top' ? 0 : pinnedRowsData.top.length + mainRowsLength,
  });

  return (
    <Element {...other} className={clsx(classes.root, other.className)} role="presentation">
      {pinnedRows}
    </Element>
  );
}
