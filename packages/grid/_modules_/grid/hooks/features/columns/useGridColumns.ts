import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridColumnInformation } from './useGridColumnInformation';
import { useGridVisibleColumns } from './useGridVisibleColumns';
import { useGridColumnUpdates } from './useGridColumnUpdates';

export const useGridColumns = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'columnTypes' | 'checkboxSelection' | 'onColumnVisibilityChange'
  >,
): void => {
  useGridColumnUpdates(apiRef, props);
  useGridVisibleColumns(apiRef, props);
  useGridColumnInformation(apiRef);
};
