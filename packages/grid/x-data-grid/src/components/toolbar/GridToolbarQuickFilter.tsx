import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridQuickFilterValuesSelector } from '../../hooks/features/filter';
import { GridFilterModel } from '../../models/gridFilterModel';
import { isDeepEqual } from '../../utils/utils';

const GridToolbarQuickFilterRoot = styled(TextField, {
  name: 'MuiDataGrid',
  slot: 'ToolbarQuickFilter',
  overridesResolver: (props, styles) => styles.toolbarQuickFilter,
})(({ theme }) => ({
  width: 'auto',
  paddingBottom: theme.spacing(0.5),
  '& input': {
    marginLeft: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& input[type=search]::-ms-clear,
& input[type=search]::-ms-reveal`]: {
    /* clears the 'X' icon from IE */
    display: 'none',
    width: 0,
    height: 0,
  },
  [`& input[type="search"]::-webkit-search-decoration,
  & input[type="search"]::-webkit-search-cancel-button,
  & input[type="search"]::-webkit-search-results-button,
  & input[type="search"]::-webkit-search-results-decoration`]: {
    /* clears the 'X' icon from Chrome */
    display: 'none',
  },
}));

const defaultSearchValueParser = (searchText: string) =>
  searchText.split(' ').filter((word) => word !== '');

const defaultSearchValueFormatter = (values: string[]) => values.join(' ');

export type GridToolbarQuickFilterProps = TextFieldProps & {
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser?: (input: string) => any[];
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   */
  quickFilterFormatter?: (values: GridFilterModel['quickFilterValues']) => string;
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs?: number;
};

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const {
    quickFilterParser = defaultSearchValueParser,
    quickFilterFormatter = defaultSearchValueFormatter,
    debounceMs = 500,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const quickFilterValues = useGridSelector(apiRef, gridQuickFilterValuesSelector);

  const [searchValue, setSearchValue] = React.useState(() =>
    quickFilterFormatter(quickFilterValues ?? []),
  );

  const [prevQuickFilterValues, setPrevQuickFilterValues] = React.useState(quickFilterValues);

  React.useEffect(() => {
    if (!isDeepEqual(prevQuickFilterValues, quickFilterValues)) {
      // The model of quick filter value has been updated
      setPrevQuickFilterValues(quickFilterValues);

      // Update the input value if needed to match the new model
      setSearchValue((prevSearchValue) =>
        isDeepEqual(quickFilterParser(prevSearchValue), quickFilterValues)
          ? prevSearchValue
          : quickFilterFormatter(quickFilterValues ?? []),
      );
    }
  }, [prevQuickFilterValues, quickFilterValues, quickFilterFormatter, quickFilterParser]);

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

  const handleSearchReset = React.useCallback(() => {
    setSearchValue('');
    updateSearchValue('');
  }, [updateSearchValue]);

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
        startAdornment: <rootProps.components.QuickFilterIcon fontSize="small" />,
        endAdornment: (
          <IconButton
            aria-label={apiRef.current.getLocaleText('toolbarQuickFilterDeleteIconLabel')}
            size="small"
            sx={{ visibility: searchValue ? 'visible' : 'hidden' }}
            onClick={handleSearchReset}
          >
            <rootProps.components.QuickFilterClearIcon fontSize="small" />
          </IconButton>
        ),
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
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   */
  quickFilterFormatter: PropTypes.func,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser: PropTypes.func,
} as any;

export { GridToolbarQuickFilter };
