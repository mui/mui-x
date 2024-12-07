import * as React from 'react';
import { GridContextProvider } from '../../context/GridContextProvider';
import { useDataGridProps } from '../../DataGrid/useDataGridProps';
import { useDataGridComponent } from '../../DataGrid/useDataGridComponent';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributes } from '../../hooks/features/rows/useGridRowAriaAttributes';
import { DataGridProps } from '../../models/props/DataGridProps';
import { GridValidRowModel } from '../../models/gridRows';
import { GridColDef } from '../../models/colDef';

interface DemoContainerProps<R extends GridValidRowModel> extends Partial<DataGridProps<R>> {
  children: React.ReactNode;
}

const CONFIGURATION = {
  hooks: {
    useGridAriaAttributes,
    useGridRowAriaAttributes,
  },
};

const DEFAULT_COLUMNS: GridColDef[] = [];

/**
 * WARNING: This is an internal component used in documentation to provide the required context for demos.
 * Please do not use it in your application.
 */
export function DemoContainer<R extends GridValidRowModel>(inProps: DemoContainerProps<R>) {
  const { children } = inProps;

  const props = useDataGridProps({ columns: DEFAULT_COLUMNS, ...inProps });
  const privateApiRef = useDataGridComponent(props.apiRef, props);

  return (
    <GridContextProvider privateApiRef={privateApiRef} configuration={CONFIGURATION} props={props}>
      {children}
    </GridContextProvider>
  );
}
