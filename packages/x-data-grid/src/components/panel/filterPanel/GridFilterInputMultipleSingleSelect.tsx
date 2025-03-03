import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { AutocompleteProps } from '../../../models/gridBaseSlots';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import type { GridSingleSelectColDef, ValueOptions } from '../../../models/colDef/gridColDef';
import { getValueOptions, isSingleSelectColDef } from './filterPanelUtils';

export type GridFilterInputMultipleSingleSelectProps = GridFilterInputValueProps<
  Omit<AutocompleteProps<ValueOptions, true, false, true>, 'options'>
> & {
  type?: 'singleSelect';
};

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

  const BaseAutocomplete = rootProps.slots.baseAutocomplete as React.JSXElementConstructor<
    AutocompleteProps<ValueOptions, true, false, true>
  >;

  return (
    <BaseAutocomplete
      multiple
      options={resolvedValueOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      id={id}
      value={filteredValues}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      slotProps={{
        textField: {
          type: type || 'text',
          inputRef: focusElementRef,
        },
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
      current: function (props, propName) {
        if (props[propName] == null) {
          return null;
        } else if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
          return new Error("Expected prop '" + propName + "' to be of type Element");
        }
      },
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
