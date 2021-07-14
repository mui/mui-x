import PropTypes from 'prop-types';
import * as React from 'react';
import { IconButton, TextField } from '@material-ui/core';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

const QuickSearchToolbar = (props) => {
  return (
    <GridToolbarContainer
      style={{
        justifyContent: 'space-between',
      }}
    >
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        value={props.value}
        onChange={props.onChange}
        placeholder="Search..."
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
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
};

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

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
    const searchRegex = new RegExp(`.*${searchValue}.*`, 'ig');
    const filteredRows = data.rows.filter((o) => {
      return Object.keys(o).some((k) => {
        return searchRegex.test(o[k].toString());
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
