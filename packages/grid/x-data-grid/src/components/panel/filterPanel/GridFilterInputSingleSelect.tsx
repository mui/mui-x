import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridSingleSelectColDef } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueFromValueOptions, isSingleSelectColDef } from './filterPanelUtils';

const renderSingleSelectOptions = (
  { valueOptions, field }: GridSingleSelectColDef,
  OptionComponent: React.ElementType,
  getOptionLabel: NonNullable<GridSingleSelectColDef['getOptionLabel']>,
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>,
) => {
  const iterableColumnValues =
    typeof valueOptions === 'function'
      ? ['', ...valueOptions({ field })]
      : ['', ...(valueOptions || [])];

  return iterableColumnValues.map((option) => {
    const value = getOptionValue(option);
    const label = getOptionLabel(option);

    return (
      <OptionComponent key={value} value={value}>
        {label}
      </OptionComponent>
    );
  });
};

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps &
  TextFieldProps &
  Pick<GridSingleSelectColDef, 'getOptionLabel' | 'getOptionValue'> & {
    type?: 'singleSelect';
  };

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    getOptionLabel: getOptionLabelProp,
    getOptionValue: getOptionValueProp,
    ...others
  } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const id = useId();
  const rootProps = useGridRootProps();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;

  let resolvedColumn: GridSingleSelectColDef | null = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }

  const getOptionValue = getOptionValueProp || resolvedColumn?.getOptionValue!;
  const getOptionLabel = getOptionLabelProp || resolvedColumn?.getOptionLabel!;

  const currentValueOptions = React.useMemo(() => {
    if (!resolvedColumn) {
      return undefined;
    }
    return typeof resolvedColumn.valueOptions === 'function'
      ? resolvedColumn.valueOptions({ field: resolvedColumn.field })
      : resolvedColumn.valueOptions;
  }, [resolvedColumn]);

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;

      // NativeSelect casts the value to a string.
      value = getValueFromValueOptions(value, currentValueOptions, getOptionValue);

      setFilterValueState(String(value));
      applyValue({ ...item, value });
    },
    [currentValueOptions, getOptionValue, applyValue, item],
  );

  React.useEffect(() => {
    let itemValue;

    if (currentValueOptions !== undefined) {
      // sanitize if valueOptions are provided
      itemValue = getValueFromValueOptions(item.value, currentValueOptions, getOptionValue);
      if (itemValue !== item.value) {
        applyValue({ ...item, value: itemValue });
        return;
      }
    } else {
      itemValue = item.value;
    }

    itemValue = itemValue ?? '';

    setFilterValueState(String(itemValue));
  }, [item, currentValueOptions, applyValue, getOptionValue]);

  if (!isSingleSelectColDef(resolvedColumn)) {
    return null;
  }

  if (!isSingleSelectColDef(resolvedColumn)) {
    return null;
  }

  return (
    <rootProps.slots.baseTextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      type={type || 'text'}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      select
      SelectProps={{
        native: isSelectNative,
        ...rootProps.slotProps?.baseSelect,
      }}
      {...others}
      {...rootProps.slotProps?.baseTextField}
    >
      {renderSingleSelectOptions(
        resolvedColumn,
        isSelectNative ? 'option' : MenuItem,
        getOptionLabel,
        getOptionValue,
      )}
    </rootProps.slots.baseTextField>
  );
}

GridFilterInputSingleSelect.propTypes = {
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
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: PropTypes.func,
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue: PropTypes.func,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputSingleSelect };
