import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';

const SelectEditInputCell = (props: GridRenderEditCellParams) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.value }, event);
    apiRef.current.commitCellChange({ id, field });
    apiRef.current.setCellMode(id, field, 'view');
  };

  return (
    <Select value={value} onChange={handleChange} open>
      <MenuItem value="Nike">Nike</MenuItem>
      <MenuItem value="Adidas">Adidas</MenuItem>
      <MenuItem value="Puma">Puma</MenuItem>
      <MenuItem value="Gucci">Gucci</MenuItem>
    </Select>
  );
};

function renderSelectEditInputCell(params) {
  return <SelectEditInputCell {...params} />;
}

const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [
    {
      field: 'brand',
      width: 100,
      editable: true,
      renderEditCell: renderSelectEditInputCell,
    },
  ],
};

export default function SelectEditCell() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...baselineProps} />
    </div>
  );
}
