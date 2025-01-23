import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import { unstable_useId as useId } from '@mui/utils';
import { getValueOptions, isSingleSelectColDef } from './filterPanelUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import type { GridSingleSelectColDef, ValueOptions } from '../../../models/colDef/gridColDef';

export type GridFilterInputMultipleSingleSelectProps = GridFilterInputValueProps<
  Omit<AutocompleteProps<ValueOptions, true, false, true>, 'options' | 'renderInput'>
> & {
  type?: 'singleSelect';
};

const filter = createFilterOptions<any>();

function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps) {
  const { item, applyValue, type, apiRef, focusElementRef, slotProps, ...other } = props;

  const id = useId();
  const rootProps = useGridRootProps();

  let resolvedColumn: GridSingleSelectColDef | null = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }

  const getOptionValue = resolvedColumn?.getOptionValue!;
  const getOptionLabel = resolvedColumn?.getOptionLabel!;

  const isOptionEqualToValue = React.useCallback(
    (option: ValueOptions, value: ValueOptions) => getOptionValue(option) === getOptionValue(value),
    [getOptionValue],
  );

  const resolvedValueOptions = React.useMemo(() => {
    return getValueOptions(resolvedColumn!) || [];
  }, [resolvedColumn]);

  // The value is computed from the item.value and used directly
  // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
  const filteredValues = React.useMemo(() => {
    if (!Array.isArray(item.value)) {
      return [];
    }

    return item.value.reduce<ValueOptions[]>((acc, value) => {
      const resolvedValue = resolvedValueOptions.find((v) => getOptionValue(v) === value);
      if (resolvedValue != null) {
        acc.push(resolvedValue);
      }
      return acc;
    }, [] as ValueOptions[]);
  }, [getOptionValue, item.value, resolvedValueOptions]);

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<ValueOptions, true, false, true>['onChange']>
  >(
    (event, value) => {
      applyValue({ ...item, value: value.map(getOptionValue) });
    },
    [applyValue, item, getOptionValue],
  );

  return (
    <Autocomplete<ValueOptions, true, false, true>
      multiple
      options={resolvedValueOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={filter}
      id={id}
      value={filteredValues}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <rootProps.slots.baseChip
              key={key}
              variant="outlined"
              size="small"
              label={getOptionLabel(option)}
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
      {...other}
      {...slotProps?.root}
    />
  );
}

GridFilterInputMultipleSingleSelect.propTypes = {
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
  type: PropTypes.oneOf(['singleSelect']),
} as any;

export { GridFilterInputMultipleSingleSelect };
