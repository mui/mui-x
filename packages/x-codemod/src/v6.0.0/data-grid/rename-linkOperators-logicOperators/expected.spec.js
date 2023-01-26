import * as React from 'react'
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid'

function App ({ apiRef }) {
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    logicOperator: GridLogicOperator.Or,
    quickFilterLogicOperator: GridLogicOperator.Or,
  });
  apiRef.current.setFilterLogicOperator('and')
  const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator')
  return (
    <React.Fragment>
      <DataGrid
        initialState={{
          filter: {
            filterModel: {
              items: [],
              logicOperator: GridLogicOperator.Or,
              quickFilterLogicOperator: GridLogicOperator.Or,
            },
          },
        }}
        filterModel={filterModel}
        componentsProps={{
          filter: {
            logicOperators: [GridLogicOperator.And],
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        }}
        sx={{
          '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
        }}
      />
    </React.Fragment>
  );
}

export default App
