import * as React from 'react';
import PropTypes from 'prop-types';
import { refType, unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { TextFieldProps } from '../../../models/gridBaseSlots';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';

export type GridFilterInputBooleanProps = GridFilterInputValueProps<TextFieldProps>;

function GridFilterInputBoolean(props: GridFilterInputBooleanProps) {
  const {
    item,
    applyValue,
    apiRef,
    focusElementRef,
    isFilterActive,
    headerFilterMenu,
    clearButton,
    tabIndex,
    slotProps,
    ...others
  } = props;
  const [filterValueState, setFilterValueState] = React.useState<boolean | undefined>(
    sanitizeFilterItemValue(item.value),
  );
  const rootProps = useGridRootProps();

  const labelId = useId();
  const selectId = useId();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? false;

  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = sanitizeFilterItemValue(event.target.value);
      setFilterValueState(value);

      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    setFilterValueState(sanitizeFilterItemValue(item.value));
  }, [item.value]);

  const label = slotProps?.root.label ?? apiRef.current.getLocaleText('filterPanelInputLabel');
  const rootSlotProps = slotProps?.root.slotProps;

  return (
    <React.Fragment>
      <rootProps.slots.baseSelect
        fullWidth
        labelId={labelId}
        id={selectId}
        label={label}
        value={filterValueState === undefined ? '' : String(filterValueState)}
        onChange={onFilterChange}
        native={isSelectNative}
        slotProps={{
          htmlInput: {
            ref: focusElementRef,
            tabIndex,
            ...rootSlotProps?.htmlInput,
          },
        }}
        {...baseSelectProps}
        {...others}
        {...slotProps?.root}
      >
        <rootProps.slots.baseSelectOption
          {...baseSelectOptionProps}
          native={isSelectNative}
          value=""
        >
          {apiRef.current.getLocaleText('filterValueAny')}
        </rootProps.slots.baseSelectOption>
        <rootProps.slots.baseSelectOption
          {...baseSelectOptionProps}
          native={isSelectNative}
          value="true"
        >
          {apiRef.current.getLocaleText('filterValueTrue')}
        </rootProps.slots.baseSelectOption>
        <rootProps.slots.baseSelectOption
          {...baseSelectOptionProps}
          native={isSelectNative}
          value="false"
        >
          {apiRef.current.getLocaleText('filterValueFalse')}
        </rootProps.slots.baseSelectOption>
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

export function sanitizeFilterItemValue(value: any): boolean | undefined {
  if (String(value).toLowerCase() === 'true') {
    return true;
  }
  if (String(value).toLowerCase() === 'false') {
    return false;
  }
  return undefined;
}

GridFilterInputBoolean.propTypes = {
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
  focusElementRef: refType,
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
} as any;

export { GridFilterInputBoolean };
