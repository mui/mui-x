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
      !props.unstable_dataSource &&
      'MUI X: The `filterMode="server"` prop is not available when the `treeData` is enabled.') ||
    undefined,
  (props) =>
    (!props.pagination &&
      props.checkboxSelectionVisibleOnly &&
      'MUI X: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.') ||
    undefined,
  (props) =>
    (!props.unstable_dataSource &&
      !props.rows &&
      'MUI X: One of `rows` prop or `unstable_dataSource` prop must be passed for the Grid to work as expected.') ||
    undefined,
  (props) =>
    (props.unstable_dataSource &&
      props.rows &&
      'MUI X: The `rows` prop has no effect when the `unstable_dataSource` prop is passed.') ||
    undefined,
];
