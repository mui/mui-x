import * as React from 'react';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  DataGrid,
  GridRenderEditCellParams,
  useGridApiContext,
  DataGridProps,
} from '@mui/x-data-grid';

function SelectEditInputCell(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange: SelectProps['onChange'] = async (event) => {
    await apiRef.current.setEditCellValue({ id, field, value: event.target.value }, event);
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} open>
      <MenuItem value="Nike">Nike</MenuItem>
      <MenuItem value="Adidas">Adidas</MenuItem>
      <MenuItem value="Puma">Puma</MenuItem>
      <MenuItem value="Gucci">Gucci</MenuItem>
    </Select>
  );
}

const baselineProps: DataGridProps = {
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
      renderEditCell: (params) => <SelectEditInputCell {...params} />,
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
