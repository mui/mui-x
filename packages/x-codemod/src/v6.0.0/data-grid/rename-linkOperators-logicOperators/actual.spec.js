import * as React from 'react'
import { DataGrid, GridLinkOperator } from '@mui/x-data-grid'

function App ({ apiRef }) {
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    linkOperator: GridLinkOperator.Or,
    quickFilterLogicOperator: GridLinkOperator.Or,
  });
  apiRef.current.setFilterLinkOperator('and')
  const localeText = apiRef.current.getLocaleText('filterPanelLinkOperator')
  return (
    <React.Fragment>
      <DataGrid
        initialState={{
          filter: {
            filterModel: {
              items: [],
              linkOperator: GridLinkOperator.Or,
              quickFilterLogicOperator: GridLinkOperator.Or,
            },
          },
        }}
        filterModel={filterModel}
        componentsProps={{
          filter: {
            linkOperators: [GridLinkOperator.And],
            filterFormProps: {
              linkOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        }}
        sx={{
          '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
        }}
      />
    </React.Fragment>
  );
}

export default App
