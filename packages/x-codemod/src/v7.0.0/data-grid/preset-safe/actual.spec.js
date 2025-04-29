import { DataGrid, CustomToolbar } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { Button, Checkbox, TextField } from '@mui/material';

export default function App() {
  return (
    <div>
      <DataGrid
        components={{
          Toolbar: CustomToolbar,
        }}
        componentsProps={{
          toolbar: {
            color: 'primary',
          },
        }}
      />
      <DataGridPro
        components={{
          BaseButton: Button,
          BaseCheckbox: Checkbox,
        }}
        componentsProps={{
          baseCheckbox: {
            checked: 'true',
          },
        }}
        experimentalFeatures={{
          lazyLoading: true,
          ariaV7: true,
          columnGrouping: true,
          clipboardPaste: true,
        }}
      />
      <DataGridPremium
        components={{
          BaseTextField: TextField,
        }}
        componentsProps={{
          baseTextField: {
            onClick: () => {
              alert('clicked');
            },
          },
        }}
        unstable_cellSelection
      />
    </div>
  );
};
