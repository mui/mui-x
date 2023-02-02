import * as React from 'react'
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-withBorderColor': { borderColor: '#456' },
    '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
  },
});

function App ({ apiRef }) {
  const classes = useStyles();
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    logicOperator: GridLogicOperator.Or,
    quickFilterLogicOperator: GridLogicOperator.Or,
  });
  apiRef.current.setFilterLogicOperator('and');
  const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator');
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default App;
