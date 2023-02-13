import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { unstable_useId as useId } from '@mui/utils';
import {
  getLabelFromValueOption,
  getValueFromOption,
  isSingleSelectColDef,
} from './filterPanelUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import type { GridSingleSelectColDef, ValueOptions } from '../../../models/colDef/gridColDef';

export interface GridFilterInputMultipleSingleSelectProps
  extends Omit<
      AutocompleteProps<ValueOptions, true, false, true>,
      | 'options'
      | 'renderInput'
      | 'onChange'
      | 'value'
      | 'id'
      | 'filterOptions'
      | 'isOptionEqualToValue'
      | 'multiple'
      | 'color'
      | 'getOptionLabel'
    >,
    GridFilterInputValueProps {
  type?: 'singleSelect';
  /**
   * Used to determine the text displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel?: (value: ValueOptions) => string;
}

const isOptionEqualToValue: AutocompleteProps<
  ValueOptions,
  true,
  false,
  true
>['isOptionEqualToValue'] = (option, value) =>
  getValueFromOption(option) === getValueFromOption(value);

const filter = createFilterOptions<any>();

function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps) {
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
    getOptionLabel = getLabelFromValueOption,
    ...other
  } = props;
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant,
  };

  const id = useId();
  const rootProps = useGridRootProps();

  let resolvedColumn: GridSingleSelectColDef | null = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }

  const resolvedValueOptions = React.useMemo(() => {
    if (!resolvedColumn?.valueOptions) {
      return [];
    }

    if (typeof resolvedColumn.valueOptions === 'function') {
      return resolvedColumn.valueOptions({ field: resolvedColumn.field });
    }

    return resolvedColumn.valueOptions;
  }, [resolvedColumn]);

  const resolvedFormattedValueOptions = React.useMemo(() => {
    return resolvedValueOptions?.map(getValueFromOption);
  }, [resolvedValueOptions]);

  // The value is computed from the item.value and used directly
  // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
  const filteredValues = React.useMemo(() => {
    if (!Array.isArray(item.value)) {
      return [];
    }
    if (resolvedValueOptions !== undefined) {
      const itemValueIndexes = item.value.map((element) => {
        // get the index matching between values and valueOptions
        const formattedElement = getValueFromOption(element);
        const index =
          resolvedFormattedValueOptions?.findIndex(
            (formatedOption) => formatedOption === formattedElement,
          ) || 0;

        return index;
      });

      return itemValueIndexes
        .filter((index) => index >= 0)
        .map((index: number) => resolvedValueOptions[index]);
    }
    return item.value;
  }, [item.value, resolvedValueOptions, resolvedFormattedValueOptions]);

  React.useEffect(() => {
    if (!Array.isArray(item.value) || filteredValues.length !== item.value.length) {
      // Updates the state if the filter value has been cleaned by the component
      applyValue({ ...item, value: filteredValues.map(getValueFromOption) });
    }
  }, [item, filteredValues, applyValue]);

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<ValueOptions, true, false, true>['onChange']>
  >(
    (event, value) => {
      applyValue({ ...item, value: [...value.map(getValueFromOption)] });
    },
    [applyValue, item],
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
        value.map((option, index) => (
          <Chip
            variant="outlined"
            size="small"
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <rootProps.components.BaseTextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
          placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          inputRef={focusElementRef}
          type="singleSelect"
          {...TextFieldProps}
          {...rootProps.componentsProps?.baseTextField}
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
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Used to determine the text displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: PropTypes.func,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  type: PropTypes.oneOf(['singleSelect']),
} as any;

export { GridFilterInputMultipleSingleSelect };
