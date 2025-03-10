import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { useTimeout } from '../../../hooks/utils/useTimeout';
import { TextFieldProps } from '../../../models/gridBaseSlots';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridTypeFilterInputValueProps = GridFilterInputValueProps<TextFieldProps> & {
  type?: 'text' | 'number' | 'date' | 'datetime-local';
};

type ItemPlusTag = GridFilterItem & { fromInput?: string };

function GridFilterInputValue(props: GridTypeFilterInputValueProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    tabIndex,
    disabled,
    isFilterActive,
    slotProps,
    clearButton,
    headerFilterMenu,
    ...others
  } = props;
  const textFieldProps = slotProps?.root;

  const filterTimeout = useTimeout();
  const [filterValueState, setFilterValueState] = React.useState<string | undefined>(
    sanitizeFilterItemValue(item.value),
  );
  const lastValue = React.useRef<string | undefined>(filterValueState);
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeFilterItemValue(event.target.value);

      setFilterValueState(value);
      setIsApplying(true);
      filterTimeout.start(rootProps.filterDebounceMs, () => {
        const newItem = {
          ...item,
          value: type === 'number' && !Number.isNaN(Number(value)) ? Number(value) : value,
          fromInput: id!,
        };
        applyValue(newItem);
        setIsApplying(false);
      });
    },
    [filterTimeout, rootProps.filterDebounceMs, item, type, id, applyValue],
  );

  React.useEffect(() => {
    const itemPlusTag = item as ItemPlusTag;
    const sanitizedValue = sanitizeFilterItemValue(item.value);
    if (
      itemPlusTag.fromInput !== id ||
      item.value == null ||
      sanitizedValue !== lastValue.current
    ) {
      setFilterValueState(sanitizedValue);
      lastValue.current = sanitizedValue;
    }
  }, [id, item]);

  return (
    <React.Fragment>
      <rootProps.slots.baseTextField
        id={id}
        label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
        value={filterValueState ?? ''}
        onChange={onFilterChange}
        type={type || 'text'}
        disabled={disabled}
        slotProps={{
          ...textFieldProps?.slotProps,
          input: {
            endAdornment: applying ? (
              <rootProps.slots.loadIcon fontSize="small" color="action" />
            ) : null,
            ...textFieldProps?.slotProps?.input,
          },
          htmlInput: {
            tabIndex,
            ...textFieldProps?.slotProps?.htmlInput,
          },
        }}
        inputRef={focusElementRef}
        {...rootProps.slotProps?.baseTextField}
        {...others}
        {...textFieldProps}
      />
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

function sanitizeFilterItemValue(value: unknown) {
  if (value == null || value === '') {
    return undefined;
  }

  return String(value);
}

GridFilterInputValue.propTypes = {
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
  type: PropTypes.oneOf(['date', 'datetime-local', 'number', 'text']),
} as any;

export { GridFilterInputValue };
