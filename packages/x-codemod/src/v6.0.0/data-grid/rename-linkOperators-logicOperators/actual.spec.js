import * as React from 'react'
import { DataGrid, GridLinkOperator } from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-withBorder': { borderColor: '#456' },
    '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
  },
});

function App ({ apiRef }) {
  const classes = useStyles();
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    linkOperator: GridLinkOperator.Or,
    quickFilterLogicOperator: GridLinkOperator.Or,
  });
  apiRef.current.setFilterLinkOperator('and');
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
    </React.Fragment>
  );
}

export default App;
