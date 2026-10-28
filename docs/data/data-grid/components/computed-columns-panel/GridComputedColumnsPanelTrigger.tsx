import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  ComputedColumnsPanelTrigger,
  GridColDef,
  GridRowsProp,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import Tooltip from '@mui/material/Tooltip';
import CalculateIcon from '@mui/icons-material/Calculate';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Computed columns">
        <ComputedColumnsPanelTrigger
          render={(triggerProps, state) => (
            <ToolbarButton
              {...triggerProps}
              color={state.open ? 'primary' : 'default'}
            />
          )}
        >
          <CalculateIcon fontSize="small" />
        </ComputedColumnsPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product', width: 180 },
  { field: 'price', headerName: 'Price', type: 'number', width: 100 },
  { field: 'quantity', headerName: 'Qty', type: 'number', width: 80 },
];

const rows: GridRowsProp = [
  { id: 1, product: 'Laptop workstation', price: 1650, quantity: 4 },
  { id: 2, product: 'Ultrawide monitor', price: 420, quantity: 8 },
  { id: 3, product: 'Docking station', price: 185, quantity: 8 },
  { id: 4, product: 'Mechanical keyboard', price: 95, quantity: 8 },
  { id: 5, product: 'Wireless mouse', price: 45, quantity: 8 },
];

export default function GridComputedColumnsPanelTrigger() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        columns={columns}
        initialState={{
          computedColumns: {
            model: [
              {
                field: 'total',
                headerName: 'Total',
                formula: '=price * quantity',
                type: 'number',
              },
            ],
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
