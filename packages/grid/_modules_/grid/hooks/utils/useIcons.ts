import * as React from 'react';
import { ApiContext } from '../../components/api-context';
import { IconsOptions } from '../../models/gridOptions';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from './optionsSelector';

export function useIcons(): IconsOptions {
  const apiRef = React.useContext(ApiContext);
  const { icons } = useGridSelector(apiRef, optionsSelector);

  if (!icons) {
    throw new Error('Missing set of icons in grid options');
  }
  if (!icons.ColumnSortedAscending || !icons.ColumnSortedDescending || !icons.ColumnResize) {
    throw new Error('Missing icons in options or default options.');
  }
  return icons;
}
