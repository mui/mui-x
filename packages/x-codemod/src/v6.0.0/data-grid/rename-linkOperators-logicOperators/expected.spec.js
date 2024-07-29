import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPremium, GridLogicOperator } from '@mui/x-data-grid-premium'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-withBorderColor': { borderColor: '#456' },
    '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
  },
});

function Wrapper () {
  const apiRef = {};
  return (
    <App 
      apiRef={apiRef}
      initialState={{
        filter: {
          filterModel: {
            items: [],
            logicOperator: GridLogicOperator.Or,
            quickFilterLogicOperator: GridLogicOperator.Or,
          },
        },
      }}/>
  );
}

function App ({ apiRef, initialState }) {
  const classes = useStyles();
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    logicOperator: GridLogicOperator.Or,
    quickFilterLogicOperator: GridLogicOperator.Or,
  });
  apiRef.current.setFilterLogicOperator('and');
  const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(1);
  const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator');
  return (
    (<React.Fragment>
      <DataGrid
        className={classes.root}
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
          '& .MuiDataGrid-withBorderColor': { borderColor: '#456' },
        }}
      />
      <DataGridPremium initialState={initialState} />
    </React.Fragment>)
  );
}

export default App;
