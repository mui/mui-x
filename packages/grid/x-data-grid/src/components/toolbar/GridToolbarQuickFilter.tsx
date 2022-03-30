import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const GridToolbarQuickFilterRoot = styled(TextField, {
  name: 'MuiDataGrid',
  slot: 'ToolbarQuickFilter',
  overridesResolver: (props, styles) => styles.toolbarQuickFilter,
})(({ theme }) => ({
  width: 'auto',
  m: theme.spacing(1, 0.5, 1.5),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: 1,
    borderColor: 'divider',
  },
}));

const defaultSearchValueParser = (searchText: string) => searchText.split(' ').filter((word) => word !== '')

export type GridToolbarQuickFilterProps = TextFieldProps & {
  quickFilterParser?: (input: string) => any[]
}

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const { quickFilterParser = defaultSearchValueParser, ...other } = props

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchValueChange = React.useCallback((event) => {
    const newSearchValue = event.target.value;
    setSearchValue(newSearchValue)
    apiRef.current.setQuickFilterValues(quickFilterParser(newSearchValue))

  }, [apiRef, quickFilterParser])

  const clearSearchValue = React.useCallback(() => {
    setSearchValue('')
    apiRef.current.setQuickFilterValues([]);
  }, [apiRef])

  return (
    <GridToolbarQuickFilterRoot
      as={rootProps.components.BaseTextField}
      variant="standard"
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder="Search…"
      InputProps={{
        startAdornment: <SearchIcon fontSize="small" />,
        endAdornment: (
          <IconButton
            title="Clear"
            aria-label="Clear"
            size="small"
            style={{ visibility: searchValue ? 'visible' : 'hidden' }}
            onClick={clearSearchValue}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
      {...other}
    />
  );
}
export default GridToolbarQuickFilter;
