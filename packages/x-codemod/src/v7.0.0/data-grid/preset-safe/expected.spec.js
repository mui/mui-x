import { DataGrid, CustomToolbar } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { Button, Checkbox, TextField } from '@mui/material';

export default function App() {
  return (
    (<div>
      <DataGrid
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            color: 'primary',
          },
        }}
      />
      <DataGridPro
        slots={{
          baseButton: Button,
          baseCheckbox: Checkbox,
        }}
        slotProps={{
          baseCheckbox: {
            checked: 'true',
          },
        }} />
      <DataGridPremium
        slots={{
          baseTextField: TextField,
        }}
        slotProps={{
          baseTextField: {
            onClick: () => {
              alert('clicked');
            },
          },
        }}
        cellSelection
      />
    </div>)
  );
};
