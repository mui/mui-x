import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import type { CountryStats } from '../types/electricity';

interface CountryGridProps {
  data: CountryStats[];
  selectedCountries: Set<string>;
  onSelectedCountriesChange: (selected: Set<string>) => void;
}

function SparklineCell({ value, color }: { value: number[]; color: string }) {
  if (!value || value.length === 0) {
    return null;
  }
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
      <SparkLineChart data={value} height={30} color={color} showTooltip />
    </Box>
  );
}

const columns: GridColDef<CountryStats>[] = [
  {
    field: 'name',
    headerName: 'Country',
    width: 120,
    flex: 1,
  },
  {
    field: 'avgGeneration',
    headerName: 'Avg Gen (MW)',
    width: 120,
    type: 'number',
    valueFormatter: (value: number) => Math.round(value).toLocaleString(),
  },
  {
    field: 'avgEmissions',
    headerName: 'Avg CO₂',
    width: 100,
    type: 'number',
    valueFormatter: (value: number) => `${Math.round(value)}`,
    cellClassName: (params) => {
      const val = params.value as number;
      if (val < 100) {
        return 'emissions-low';
      }
      if (val < 300) {
        return 'emissions-medium';
      }
      return 'emissions-high';
    },
  },
  {
    field: 'generationTrend',
    headerName: 'Generation Trend',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<CountryStats, number[]>) => (
      <SparklineCell value={params.value ?? []} color="#1976d2" />
    ),
  },
  {
    field: 'emissionsTrend',
    headerName: 'Emissions Trend',
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<CountryStats, number[]>) => (
      <SparklineCell value={params.value ?? []} color="#d32f2f" />
    ),
  },
];

export function CountryGrid({
  data,
  selectedCountries,
  onSelectedCountriesChange,
}: CountryGridProps) {
  const rowSelectionModel = React.useMemo(
    () => ({ type: 'include' as const, ids: selectedCountries }),
    [selectedCountries],
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Country Comparison
      </Typography>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          '& .emissions-low': {
            color: 'success.main',
            fontWeight: 600,
          },
          '& .emissions-medium': {
            color: 'warning.main',
            fontWeight: 600,
          },
          '& .emissions-high': {
            color: 'error.main',
            fontWeight: 600,
          },
        }}
      >
        <DataGridPro
          rows={data}
          columns={columns}
          getRowId={(row) => row.code}
          density="compact"
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newSelection) =>
            onSelectedCountriesChange(newSelection.ids as Set<string>)
          }
          hideFooter
          initialState={{
            sorting: {
              sortModel: [{ field: 'avgEmissions', sort: 'asc' }],
            },
          }}
        />
      </Box>
    </Box>
  );
}
