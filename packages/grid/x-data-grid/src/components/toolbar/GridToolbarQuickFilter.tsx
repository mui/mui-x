import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const GridToolbarQuickFilterRoot = styled(TextField, {
  name: 'MuiDataGrid',
  slot: 'ToolbarQuickFilter',
  overridesResolver: (props, styles) => styles.toolbarQuickFilter,
})(({ theme }) => ({
  width: 'auto',
  margin: theme.spacing(1, 0.5, 1.5, 0.5),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: 1,
    borderColor: 'divider',
  },
}));

const defaultSearchValueParser = (searchText: string) =>
  searchText.split(' ').filter((word) => word !== '');

export type GridToolbarQuickFilterProps = TextFieldProps & {
  quickFilterParser?: (input: string) => any[];
  debounceMs?: number;
};

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const { quickFilterParser = defaultSearchValueParser, debounceMs = 500, ...other } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const [searchValue, setSearchValue] = React.useState('');

  const updateSearchValue = React.useCallback(
    (newSearchValue) => {
      apiRef.current.setQuickFilterValues(
        quickFilterParser(newSearchValue).filter((value) => value !== ''),
      );
    },
    [apiRef, quickFilterParser],
  );

  const debouncedUpdateSearchValue = React.useMemo(
    () => debounce(updateSearchValue, debounceMs),
    [updateSearchValue, debounceMs],
  );

  const handleSearchValueChange = React.useCallback(
    (event) => {
      const newSearchValue = event.target.value;
      setSearchValue(newSearchValue);
      debouncedUpdateSearchValue(newSearchValue);
    },
    [debouncedUpdateSearchValue],
  );

  const clearSearchValue = React.useCallback(() => {
    setSearchValue('');
    apiRef.current.setQuickFilterValues([]);
  }, [apiRef]);

  return (
    <GridToolbarQuickFilterRoot
      as={rootProps.components.BaseTextField}
      variant="standard"
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder="Search…"
      label={apiRef.current.getLocaleText('toolbarQuickFilter')}
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
      // for more details, see: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role
      role="search"
      aria-label="Grid"
      {...other}
    />
  );
}

GridToolbarQuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  debounceMs: PropTypes.number,
  quickFilterParser: PropTypes.func,
} as any;

export { GridToolbarQuickFilter };
