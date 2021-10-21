import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import TextField from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridLoadIcon } from '../../icons/index';
import { GridFilterInputMultipleValueProps } from './GridFilterInputMultipleValueProps';

export const SUBMIT_FILTER_STROKE_TIME = 500;

export interface GridTypeFilterInputMultipleValueProps extends GridFilterInputMultipleValueProps {
  type?: 'text' | 'number' | 'singleSelect';
}

function GridFilterInputMultipleValue(
  props: GridTypeFilterInputMultipleValueProps &
    Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>,
) {
  const { item, applyValue, type, apiRef, ...others } = props;
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map((x) => String(x)));
  }, [item.value]);

  const onFilterChange = React.useCallback(
    (e, value) => {
      // NativeSelect casts the value to a string.
      if (type === 'singleSelect') {
        const column = apiRef.current.getColumn(item.columnField);
        value = column.valueOptions
          .map((option) => (typeof option === 'object' ? option.value : option))
          .filter((optionValue) => value.includes(String(optionValue)));
      }

      clearTimeout(filterTimeout.current);
      setFilterValueState(value.map((x) => String(x)));

      if (type !== 'singleSelect' && value === []) {
        setIsApplying(false);
        return;
      }

      setIsApplying(true);
      // TODO singleSelect doesn't a debounce
      filterTimeout.current = setTimeout(() => {
        applyValue({ ...item, value: [...value] });
        setIsApplying(false);
      }, SUBMIT_FILTER_STROKE_TIME);
    },
    [apiRef, applyValue, item, type],
  );

  const InputProps = applying ? { endAdornment: <GridLoadIcon /> } : {};

  return (
    <Autocomplete
      {...others}
      multiple
      freeSolo
      options={
        type === 'singleSelect' ? apiRef.current.getColumn(item.columnField).valueOptions : []
      }
      id={id}
      value={filterValueState}
      onChange={onFilterChange}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
          InputProps={{ ...params.InputProps, ...InputProps }}
          type={type || 'text'}
          variant="standard"
        />
      )}
    />
  );
}

GridFilterInputMultipleValue.propTypes = {
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

export { GridFilterInputMultipleValue };
