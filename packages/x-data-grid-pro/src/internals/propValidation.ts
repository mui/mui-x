import { PropValidator, propValidatorsDataGrid } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

export const propValidatorsDataGridPro: PropValidator<DataGridProProcessedProps>[] = [
  ...propValidatorsDataGrid,
  (props) =>
    (props.pagination &&
      props.hideFooterRowCount &&
      'MUI X: The `hideFooterRowCount` prop has no effect when the pagination is enabled.') ||
    undefined,
  (props) =>
    (props.treeData &&
      props.filterMode === 'server' &&
      'MUI X: The `filterMode="server"` prop is not available when the `treeData` is enabled.') ||
    undefined,
  (props) =>
    (!props.pagination &&
      props.checkboxSelectionVisibleOnly &&
      'MUI X: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.') ||
    undefined,
];
