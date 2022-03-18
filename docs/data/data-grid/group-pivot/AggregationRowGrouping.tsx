import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200, groupable: false },
    {
        field: 'company',
        headerName: 'Company',
        width: 200,
    },
    {
        field: 'gross',
        headerName: 'Gross',
        type: 'number',
        width: 150,
        groupable: false,
        valueFormatter: ({ value }) => {
            if (!value || typeof value !== 'number') {
                return value;
            }
            return `${value.toLocaleString()}$`;
        },
    }]

export default function RowGroupingInitialState() {
    const data = useMovieData();

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGridPro
                // Avoid scroll while we don't have pinned rows
                rows={data.rows.slice(0, 4)}
                columns={COLUMNS}
                disableSelectionOnClick
                initialState={{
                    rowGrouping: {
                        model: ['company'],
                    },
                    aggregation: {
                        model: {
                            gross: { method: 'sum' }
                        }
                    },
                    columns: {
                        columnVisibilityModel: {
                            company: false,
                        }
                    }
                }}
                experimentalFeatures={{
                    rowGrouping: true,
                    aggregation: true,
                }}
            />
        </div>
    );
}
