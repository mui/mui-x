import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';

export type GridFilterInputMultipleValueProps = {
  type?: 'text' | 'number' | 'date' | 'datetime-local';
} & GridFilterInputValueProps &
  Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'>;

function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    color,
    error,
    helperText,
    size,
    variant = 'standard',
    ...other
  } = props;
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant,
  };

  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = useId();

  const rootProps = useGridRootProps();

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(String));
  }, [item.value]);

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<string, true, false, true>['onChange']>
  >(
    (event, value) => {
      setFilterValueState(value.map(String));
      applyValue({ ...item, value: [...value] });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete<string, true, false, true>
      multiple
      freeSolo
      options={[]}
      filterOptions={(options, params) => {
        const { inputValue } = params;
        return inputValue == null || inputValue === '' ? [] : [inputValue];
      }}
      id={id}
      value={filterValueState}
      onChange={handleChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <rootProps.slots.baseChip
            variant="outlined"
            size="small"
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <rootProps.slots.baseTextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
          placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          inputRef={focusElementRef}
          type={type || 'text'}
          {...TextFieldProps}
          {...rootProps.slotProps?.baseTextField}
        />
      )}
      {...other}
    />
  );
}

GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  type: PropTypes.oneOf(['date', 'datetime-local', 'number', 'text']),
} as any;

export { GridFilterInputMultipleValue };
