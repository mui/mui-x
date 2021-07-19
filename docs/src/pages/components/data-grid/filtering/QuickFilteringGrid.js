import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import {
  DataGrid,
  escapeRegExp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(1, 1, 0),
      justifyContent: 'space-between',
    },
    searchInputUnderline: {
      '&:before': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  }),
  { defaultTheme },
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <GridToolbarContainer className={classes.root}>
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          classes: { underline: classes.searchInputUnderline },
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </GridToolbarContainer>
  );
}

export default function QuickFilteringGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [searchText, setSearchText] = React.useState('');
  const [rows, setRows] = React.useState(data.rows);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(data.rows);
  }, [data.rows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        columns={data.columns}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
    </div>
  );
}
