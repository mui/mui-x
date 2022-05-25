import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
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
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  const quickFilterValues = gridQuickFilterValuesSelector(apiRef);

  const [searchValue, setSearchValue] = React.useState('');
  const [prevQuickFilterValues, setPrevQuickFilterValues] = React.useState(quickFilterValues);

  React.useEffect(() => {
    if (!isDeepEqual(prevQuickFilterValues, quickFilterValues)) {
      // The model of quick filter value has been updated
      setPrevQuickFilterValues(quickFilterValues);
      if (!isDeepEqual(quickFilterParser(searchValue), quickFilterValues)) {
        // The input value and the new model are un-sync so we will update the input
        setSearchValue(quickFilterFormatter(quickFilterValues ?? []));
      }
    }
  }, [
    prevQuickFilterValues,
    quickFilterValues,
    searchValue,
    quickFilterFormatter,
    quickFilterParser,
  ]);

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
        startAdornment: <rootProps.components.QuickFilterIcon fontSize="small" />,
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
