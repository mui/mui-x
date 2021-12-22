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
  type?: 'singleSelect';
} & Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>;

const getSingleSelectOptionFormatter =
  ({ valueFormatter, field }, api) =>
  (option) => {
    if (typeof option === 'object') {
      return option.label;
    }
    return valueFormatter && option !== '' ? valueFormatter({ value: option, field, api }) : option;
  };

const getValueFromOption = (option) => (typeof option === 'object' ? option.value : option);

const isOptionEqualToValue = (option, value) =>
  getValueFromOption(option) === getValueFromOption(value);

const filter = createFilterOptions<any>();

function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps) {
  const { item, applyValue, type, apiRef, focusElementRef, ...other } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = useId();

  const currentColumn = item.columnField ? apiRef.current.getColumn(item.columnField) : null;
  const currentValueOptions = React.useMemo(() => {
    return typeof currentColumn.valueOptions === 'function'
      ? currentColumn.valueOptions({ field: currentColumn.field })
      : currentColumn.valueOptions;
  }, [currentColumn]);

  const filterValueOptionFormatter = getSingleSelectOptionFormatter(
    apiRef.current.getColumn(item.columnField),
    apiRef.current,
  );

  React.useEffect(() => {
    let itemValue;
    if (!Array.isArray(item.value)) {
      itemValue = [];
    } else if (currentValueOptions !== undefined) {
      // sanitize if valueOptions are provided
      const parsedCurrentValueOptions = currentValueOptions.map(getValueFromOption);
      const itemValueIndexes = item.value.filter((element) => {
        const formatedElement = getValueFromOption(element);
        const index = parsedCurrentValueOptions.findIndex(
          (formatedOption) => formatedOption === formatedElement,
        );
        return index;
      });
      itemValue = itemValueIndexes
        .filter((index) => index >= 0)
        .map((index) => currentValueOptions[index]);

      if (itemValue.length !== item.value.length) {
        // remove filtered values
        applyValue({ ...item, value: parsedCurrentValueOptions });
        return;
      }
    } else {
      itemValue = item.value;
    }

    itemValue = itemValue ?? [];

    setFilterValueState(itemValue);
  }, [item, currentValueOptions, applyValue]);

  const handleChange = React.useCallback(
    (event, value) => {
      setFilterValueState(value);
      applyValue({ ...item, value: [...value.map(getValueFromOption)] });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      multiple
      freeSolo={false}
      limitTags={1}
      options={currentValueOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filter}
      id={id}
      value={filterValueState}
      onChange={handleChange}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            size="small"
            label={filterValueOptionFormatter(option)}
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
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  type: PropTypes.oneOf(['singleSelect']),
} as any;

export { GridFilterInputMultipleSingleSelect };
