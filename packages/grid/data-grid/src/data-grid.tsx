import * as React from 'react';
import {
  GridComponent,
  GridComponentProps,
  GridOptions,
  classnames,
} from '@material-ui/x-grid-modules';

export type DataGridOptionsProp = Partial<
  Exclude<GridOptions, 'pagination' | 'enableMultipleColumnsSorting' | 'enableMultipleSelection'>
>;
const OPTIONS_OVERRIDES: Partial<GridOptions> = {
  pagination: true,
  enableMultipleColumnsSorting: false,
  enableMultipleSelection: false,
};

export type DataGridProps = Omit<GridComponentProps, 'licenseStatus' | 'apiRef' | 'options'> &
  DataGridOptionsProp;

const MAX_PAGE_SIZE = 100;
export const DataGrid: React.FC<DataGridProps> = React.memo(function DataGrid(
  props: DataGridProps,
) {
  React.useEffect(() => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
      throw new Error(
        `Material-UI: Option 'pageSize' cannot be above ${MAX_PAGE_SIZE}. Use the @material-ui/x-grid to unlock this feature`,
      );
    }
  }, [props.pageSize]);

  return (
    <GridComponent
      {...props}
      {...OPTIONS_OVERRIDES}
      licenseStatus="Valid"
      className={classnames('data-grid', props.className)}
    />
  );
});
