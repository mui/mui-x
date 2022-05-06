import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
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
  paddingBottom: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const defaultSearchValueParser = (searchText: string) =>
  searchText.split(' ').filter((word) => word !== '');

export type GridToolbarQuickFilterProps = TextFieldProps & {
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser?: (input: string) => any[];
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs?: number;
};

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const { quickFilterParser = defaultSearchValueParser, debounceMs = 500, ...other } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const [searchValue, setSearchValue] = React.useState('');

  const updateSearchValue = React.useCallback(
    (newSearchValue) => {
      apiRef.current.setQuickFilterValues(quickFilterParser(newSearchValue));
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

  return (
    <GridToolbarQuickFilterRoot
      as={rootProps.components.BaseTextField}
      variant="standard"
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder={apiRef.current.getLocaleText('toolbarQuickFilterPlaceholder')}
      aria-label={apiRef.current.getLocaleText('toolbarQuickFilterLabel')}
      type="search"
      InputProps={{
        startAdornment: <SearchIcon fontSize="small" />,
      }}
      {...other}
      {...rootProps.componentsProps?.baseTextField}
    />
  );
}

GridToolbarQuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs: PropTypes.number,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser: PropTypes.func,
} as any;

export { GridToolbarQuickFilter };
