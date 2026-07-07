'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { useTimeout } from '../../../hooks/utils/useTimeout';
import type { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { GridFilterItem } from '../../../models/gridFilterItem';
import type { TextFieldProps } from '../../../models/gridBaseSlots';

export type GridFilterInputDateProps = GridFilterInputValueProps<TextFieldProps> & {
  type?: 'date' | 'datetime-local';
};

function convertFilterItemValueToInputValue(
  itemValue: GridFilterItem['value'],
  inputType: GridFilterInputDateProps['type'],
) {
  if (itemValue == null) {
    return '';
  }
  const dateCopy = new Date(itemValue);
  if (Number.isNaN(dateCopy.getTime())) {
    return '';
  }
  if (inputType === 'date') {
    return dateCopy.toISOString().substring(0, 10);
  }
  if (inputType === 'datetime-local') {
    // The date picker expects the date to be in the local timezone.
    // But .toISOString() converts it to UTC with zero offset.
    // So we need to subtract the timezone offset.
    dateCopy.setMinutes(dateCopy.getMinutes() - dateCopy.getTimezoneOffset());
    return dateCopy.toISOString().substring(0, 19);
  }
  return dateCopy.toISOString().substring(0, 10);
}

function GridFilterInputDate(props: GridFilterInputDateProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    slotProps,
    isFilterActive,
    headerFilterMenu,
    clearButton,
    tabIndex,
    disabled,
    disableDebounce = false,
    ...other
  } = props;
  const rootSlotProps = slotProps?.root.slotProps;
  const filterTimeout = useTimeout();
  const [filterValueState, setFilterValueState] = React.useState(() =>
    convertFilterItemValueToInputValue(item.value, type),
  );
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();
  const debounceMs = disableDebounce ? 0 : rootProps.filterDebounceMs;

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      filterTimeout.clear();
      const value = event.target.value;
      setFilterValueState(value);

      const date = new Date(value);
      const newItem = { ...item, value: Number.isNaN(date.getTime()) ? undefined : date };

      if (debounceMs === 0) {
        applyValue(newItem);
        return;
      }

      setIsApplying(true);
      filterTimeout.start(debounceMs, () => {
        applyValue(newItem);
        setIsApplying(false);
      });
    },
    [applyValue, item, debounceMs, filterTimeout],
  );

  React.useEffect(() => {
    const value = convertFilterItemValueToInputValue(item.value, type);
    setFilterValueState(value);
  }, [item.value, type]);

  return (
    <React.Fragment>
      <rootProps.slots.baseTextField
        fullWidth
        id={id}
        label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
        value={filterValueState}
        onChange={onFilterChange}
        type={type || 'text'}
        disabled={disabled}
        inputRef={focusElementRef}
        slotProps={{
          ...rootSlotProps,
          input: {
            endAdornment:
              applying && debounceMs > 0 ? (
                <rootProps.slots.loadIcon fontSize="small" color="action" />
              ) : null,
            ...rootSlotProps?.input,
          },
          htmlInput: {
            max: type === 'datetime-local' ? '9999-12-31T23:59' : '9999-12-31',
            tabIndex,
            ...rootSlotProps?.htmlInput,
          },
        }}
        {...rootProps.slotProps?.baseTextField}
        {...other}
        {...slotProps?.root}
      />
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

GridFilterInputDate.propTypes /* remove-proptypes */ = {
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
  /**
   * If `true`, filter value changes are applied immediately without debouncing.
   * @default false
   */
  disableDebounce: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  headerFilterMenu: PropTypes.node,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: (props, propName) => {
        if (props[propName] == null) {
          return null;
        }
        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
          return new Error(`Expected prop '${propName}' to be of type Element`);
        }
        return null;
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
  type: PropTypes.oneOf(['date', 'datetime-local']),
} as any;

export { GridFilterInputDate };
