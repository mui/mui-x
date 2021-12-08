import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import TextField from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridFilterItem } from '../../../models/gridFilterItem';

export type GridFilterInputMultipleSingleSelectProps = {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: any;
  focusElementRef?: React.Ref<any>;
  type: 'singleSelect';
} & Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>;

const getSingleSelectOptionFormatter =
  ({ valueFormatter, field }, api) =>
  (option) => {
    if (typeof option === 'object') {
      return option.label;
    }
    return valueFormatter && option !== '' ? valueFormatter({ value: option, field, api }) : option;
  };

const filter = createFilterOptions<any>();

function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps) {
  const { item, applyValue, type, apiRef, focusElementRef, ...other } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = useId();

  const filterValueOptionFormater = getSingleSelectOptionFormatter(
    apiRef.current.getColumn(item.columnField),
    apiRef.current,
  );
  const filterValueParser = React.useCallback(
    (value) => String(typeof value === 'object' ? value.value : value),
    [],
  );

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(filterValueParser));
  }, [item.value, filterValueParser]);

  const isOptionEqualToValue = React.useCallback(
    (option, value) => filterValueParser(option) === String(value),
    [filterValueParser],
  );

  const onFilterChange = React.useCallback(
    (event, value) => {
      const parsedValue = value.map(filterValueParser);
      setFilterValueState(parsedValue);
      applyValue({ ...item, value: [...parsedValue] });
    },
    [applyValue, item, filterValueParser],
  );

  return (
    <Autocomplete
      multiple
      freeSolo={false}
      limitTags={1}
      options={apiRef.current.getColumn(item.columnField).valueOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filter}
      id={id}
      value={filterValueState}
      onChange={onFilterChange}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            size="small"
            label={filterValueOptionFormater(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
          placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          inputRef={focusElementRef}
          type={'singleSelect'}
          variant="standard"
        />
      )}
      {...other}
    />
  );
}

GridFilterInputMultipleSingleSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any.isRequired,
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputMultipleSingleSelect };
