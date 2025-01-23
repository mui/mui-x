import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';

export type GridFilterInputMultipleValueProps = GridFilterInputValueProps<
  Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'>
> & {
  type?: 'text' | 'number' | 'date' | 'datetime-local';
};

function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps) {
  const { item, applyValue, type, apiRef, focusElementRef, slotProps } = props;

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

      applyValue({
        ...item,
        value: [
          ...value.map((filterItemValue) =>
            type === 'number' ? Number(filterItemValue) : filterItemValue,
          ),
        ],
      });
    },
    [applyValue, item, type],
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
      onChange={handleChange as any}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <rootProps.slots.baseChip
              key={key}
              variant="outlined"
              size="small"
              label={option}
              {...tagProps}
            />
          );
        })
      }
      renderInput={(params) => {
        const { inputProps, InputProps, InputLabelProps, ...rest } = params;
        return (
          <rootProps.slots.baseTextField
            {...rest}
            label={apiRef.current.getLocaleText('filterPanelInputLabel')}
            placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
            inputRef={focusElementRef}
            type={type || 'text'}
            slotProps={{
              input: InputProps,
              inputLabel: InputLabelProps,
              htmlInput: inputProps,
            }}
            {...rootProps.slotProps?.baseTextField}
          />
        );
      }}
      {...slotProps?.root}
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
  className: PropTypes.string,
  clearButton: PropTypes.node,
  disabled: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  headerFilterMenu: PropTypes.node,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (for example `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  slotProps: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['date', 'datetime-local', 'number', 'text']),
} as any;

export { GridFilterInputMultipleValue };
