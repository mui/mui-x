import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { TextFieldProps } from '../../../models/gridBaseSlots';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';
import { GridSingleSelectColDef } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  getValueFromValueOptions,
  getValueOptions,
  isSingleSelectColDef,
} from './filterPanelUtils';
import type { GridSlotsComponentsProps } from '../../../models/gridSlotsComponentsProps';

const renderSingleSelectOptions = ({
  column,
  OptionComponent,
  getOptionLabel,
  getOptionValue,
  isSelectNative,
  baseSelectOptionProps,
}: {
  column: GridSingleSelectColDef;
  OptionComponent: React.ElementType;
  getOptionLabel: NonNullable<GridSingleSelectColDef['getOptionLabel']>;
  getOptionValue: NonNullable<GridSingleSelectColDef['getOptionValue']>;
  isSelectNative: boolean;
  baseSelectOptionProps: GridSlotsComponentsProps['baseSelectOption'];
}) => {
  const iterableColumnValues = ['', ...(getValueOptions(column) || [])];

  return iterableColumnValues.map((option) => {
    const value = getOptionValue(option);
    let label = getOptionLabel(option);
    if (label === '') {
      label = ' '; // To force the height of the empty option
    }

    return (
      <OptionComponent {...baseSelectOptionProps} native={isSelectNative} key={value} value={value}>
        {label}
      </OptionComponent>
    );
  });
};

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps<TextFieldProps> & {
  type?: 'singleSelect';
};

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    tabIndex,
    isFilterActive,
    clearButton,
    headerFilterMenu,
    slotProps,
    ...others
  } = props;
  const filterValue = item.value ?? '';
  const id = useId();
  const labelId = useId();
  const rootProps = useGridRootProps();

  const isSelectNative = rootProps.slotProps?.baseSelect?.native ?? false;

  let resolvedColumn: GridSingleSelectColDef | null = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }

  const getOptionValue = resolvedColumn?.getOptionValue!;
  const getOptionLabel = resolvedColumn?.getOptionLabel!;

  const currentValueOptions = React.useMemo(() => {
    return getValueOptions(resolvedColumn!);
  }, [resolvedColumn]);

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      let value = event.target.value;

      // NativeSelect casts the value to a string.
      value = getValueFromValueOptions(value, currentValueOptions, getOptionValue);
      applyValue({ ...item, value });
    },
    [currentValueOptions, getOptionValue, applyValue, item],
  );

  if (!isSingleSelectColDef(resolvedColumn)) {
    return null;
  }

  const label = slotProps?.root.label ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <React.Fragment>
      <rootProps.slots.baseSelect
        fullWidth
        id={id}
        label={label}
        labelId={labelId}
        value={filterValue}
        onChange={onFilterChange}
        slotProps={{
          htmlInput: {
            tabIndex,
            ref: focusElementRef,
            type: type || 'text',
            placeholder:
              slotProps?.root.placeholder ??
              apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
            ...slotProps?.root.slotProps?.htmlInput,
          },
        }}
        native={isSelectNative}
        {...rootProps.slotProps?.baseSelect}
        {...others}
        {...slotProps?.root}
      >
        {renderSingleSelectOptions({
          column: resolvedColumn,
          OptionComponent: rootProps.slots.baseSelectOption,
          getOptionLabel,
          getOptionValue,
          isSelectNative,
          baseSelectOptionProps: rootProps.slotProps?.baseSelectOption,
        })}
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

GridFilterInputSingleSelect.propTypes = {
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
  type: PropTypes.oneOf(['singleSelect']),
} as any;

export { GridFilterInputSingleSelect };
