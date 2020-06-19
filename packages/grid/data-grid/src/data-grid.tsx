import React, { useEffect, useState } from 'react';
import {
  GridComponent,
  GridComponentProps,
  DEFAULT_GRID_OPTIONS,
  GridOptions,
  mergeOptions,
} from '@material-ui/x-grid-modules';

export type DataGridOptionsProp = Partial<
  Exclude<GridOptions, 'pagination' | 'enableMultipleColumnsSorting' | 'enableMultipleSelection'>
>;
const OPTIONS_OVERRIDES: Partial<GridOptions> = {
  pagination: true,
  enableMultipleColumnsSorting: false,
  enableMultipleSelection: false,
};

type ModuleGridType = Omit<GridComponentProps, 'licenseStatus' | 'apiRef' | 'options'>;
export interface DataGridProps extends ModuleGridType {
  options: DataGridOptionsProp;
}

export const DataGrid: React.FC<DataGridProps> = React.memo(props => {
  const [internalOptions, setInternalOptions] = useState<GridOptions>(
    mergeOptions(DEFAULT_GRID_OPTIONS, {
      ...props.options,
      ...OPTIONS_OVERRIDES,
    }),
  );
  useEffect(() => {
    setInternalOptions(previousState =>
      mergeOptions(previousState, {
        ...props.options,
        ...OPTIONS_OVERRIDES,
      }),
    );
  }, [props.options]);

  return (
    <GridComponent
      rows={props.rows}
      columns={props.columns}
      loading={props.loading}
      options={internalOptions}
      licenseStatus={'Valid'}
    />
  );
});
DataGrid.displayName = 'DataGrid';
