import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPremium, GridLinkOperator } from '@mui/x-data-grid-premium'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-withBorder': { borderColor: '#456' },
    '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
  },
});

function Wrapper () {
  const apiRef = {};
  return <App 
    apiRef={apiRef}
    initialState={{
      filter: {
        filterModel: {
          items: [],
          linkOperator: GridLinkOperator.Or,
          quickFilterLogicOperator: GridLinkOperator.Or,
        },
      },
    }}/>;
}

function App ({ apiRef, initialState }) {
  const classes = useStyles();
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    linkOperator: GridLinkOperator.Or,
    quickFilterLogicOperator: GridLinkOperator.Or,
  });
  apiRef.current.setFilterLinkOperator('and');
  const rowIndex = apiRef.current.getRowIndex(1);
  const localeText = apiRef.current.getLocaleText('filterPanelLinkOperator');
  return (
    <React.Fragment>
      <DataGrid
        className={classes.root}
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
          '& .MuiDataGrid-withBorder': { borderColor: '#456' },
        }}
      />
      <DataGridPremium initialState={initialState} />
    </React.Fragment>
  );
}

export default App;
