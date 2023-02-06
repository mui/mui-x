import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import MenuItem from '@mui/material/MenuItem';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridColDef, ValueOptions } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getLabelFromValueOption, getValueFromValueOptions } from './filterPanelUtils';

const renderSingleSelectOptions = (
  { valueOptions, field }: GridColDef,
  OptionComponent: React.ElementType,
  getOptionLabel: (value: ValueOptions) => React.ReactNode,
) => {
  const iterableColumnValues =
    typeof valueOptions === 'function'
      ? ['', ...valueOptions({ field })]
      : ['', ...(valueOptions || [])];

  return iterableColumnValues.map((option) => {
    const isOptionTypeObject = typeof option === 'object';

    const value = isOptionTypeObject ? option.value : option;
    const label = getOptionLabel(option);

    return (
      <OptionComponent key={value} value={value}>
        {label}
      </OptionComponent>
    );
  });
};

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps &
  TextFieldProps & {
    type?: 'singleSelect';
    /**
     * Used to determine the text displayed for a given value option.
     * @param {ValueOptions} value The current value option.
     * @returns {string} The text to be displayed.
     */
    getOptionLabel?: (value: ValueOptions) => string;
  };

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    getOptionLabel = getLabelFromValueOption,
    ...others
  } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const id = useId();
  const rootProps = useGridRootProps();

  const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;

  const currentColumn = item.field ? apiRef.current.getColumn(item.field) : null;

  const currentValueOptions = React.useMemo(() => {
    if (currentColumn === null) {
      return undefined;
    }
    return typeof currentColumn.valueOptions === 'function'
      ? currentColumn.valueOptions({ field: currentColumn.field })
      : currentColumn.valueOptions;
  }, [currentColumn]);

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;

      // NativeSelect casts the value to a string.
      value = getValueFromValueOptions(value, currentValueOptions);

      setFilterValueState(String(value));
      applyValue({ ...item, value });
    },
    [applyValue, item, currentValueOptions],
  );

  React.useEffect(() => {
    let itemValue;

    if (currentValueOptions !== undefined) {
      // sanitize if valueOptions are provided
      itemValue = getValueFromValueOptions(item.value, currentValueOptions);
      if (itemValue !== item.value) {
        applyValue({ ...item, value: itemValue });
        return;
      }
    } else {
      itemValue = item.value;
    }

    itemValue = itemValue ?? '';

    setFilterValueState(String(itemValue));
  }, [item, currentValueOptions, applyValue]);

  return (
    <rootProps.components.BaseTextField
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
        ...rootProps.componentsProps?.baseSelect,
      }}
      {...others}
      {...rootProps.componentsProps?.baseTextField}
    >
      {renderSingleSelectOptions(
        apiRef.current.getColumn(item.field),
        isSelectNative ? 'option' : MenuItem,
        getOptionLabel,
      )}
    </rootProps.components.BaseTextField>
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
} as any;

export { GridFilterInputSingleSelect };
