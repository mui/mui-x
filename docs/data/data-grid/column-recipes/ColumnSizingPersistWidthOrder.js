import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

const useColumnsState = (apiRef, columns) => {
  const [widths, setWidths] = React.useState({});
  const [orderedFields, setOrderedFields] = React.useState(
    columns.map((column) => column.field),
  );

  const onColumnWidthChange = React.useCallback(
    ({ colDef, width }) => {
      setWidths((prev) => ({ ...prev, [colDef.field]: width }));
    },
    [setWidths],
  );

  const onColumnOrderChange = React.useCallback(() => {
    setOrderedFields(gridColumnFieldsSelector(apiRef));
  }, [apiRef, setOrderedFields]);

  const computedColumns = React.useMemo(
    () =>
      orderedFields.map((field) => {
        const column = columns.find((col) => col.field === field);
        if (widths[field]) {
          return {
            ...column,
            width: widths[field],
          };
        }
        return column;
      }),
    [columns, widths, orderedFields],
  );

  return { columns: computedColumns, onColumnWidthChange, onColumnOrderChange };
};

export default function ColumnSizingPersistWidthOrder() {
  const apiRef = useGridApiRef();
  const [index, setIndex] = React.useState(0);
  const inputColumns = React.useMemo(
    () => [
      { field: 'id' },
      { field: 'username', width: 200, key: index },
      { field: 'age', disableReorder: true },
    ],
    [index],
  );

  const columnsState = useColumnsState(apiRef, inputColumns);

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => setIndex((prev) => prev + 1)}>
        Update columns reference
      </Button>
      <div style={{ height: 250 }}>
        <DataGridPro
          apiRef={apiRef}
          columns={columnsState.columns}
          onColumnWidthChange={columnsState.onColumnWidthChange}
          onColumnOrderChange={columnsState.onColumnOrderChange}
          rows={rows}
        />
      </div>
    </div>
  );
}
