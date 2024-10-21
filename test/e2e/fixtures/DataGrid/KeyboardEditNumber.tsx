import * as React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

const baselineProps: DataGridProps = {
  rows: [{ id: 0, age: 40 }],
  columns: [{ field: 'age', type: 'number', editable: true }],
};

export default function KeyboardEditNumber() {
  const [updates, setUpdates] = React.useState<number[]>([]);
  return (
    <div>
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          {...baselineProps}
          processRowUpdate={(newRow) => {
            setUpdates((prev) => [...prev, newRow.age]);
            return newRow;
          }}
        />
      </div>
      <div>
        {updates.map((update, key) => {
          return (
            <div key={key} data-testid="new-value">
              {typeof update} {update}
            </div>
          );
        })}
      </div>
    </div>
  );
}
