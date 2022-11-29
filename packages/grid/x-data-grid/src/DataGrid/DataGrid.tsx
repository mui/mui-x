import * as React from 'react';
import { createDataGrid } from '../DataGridUnstyled';
import { useDataGridProps } from './useDataGridProps';
import { DataGridProps } from '../models/props/DataGridProps';
import { GridValidRowModel } from '../models/gridRows';

const DataGridMaterial = createDataGrid(useDataGridProps);

interface DataGridComponent {
  <R extends GridValidRowModel = any>(
    props: DataGridProps<R> & React.RefAttributes<HTMLDivElement>,
  ): JSX.Element;
  propTypes?: any;
}

export const DataGrid = React.memo(DataGridMaterial) as DataGridComponent;
