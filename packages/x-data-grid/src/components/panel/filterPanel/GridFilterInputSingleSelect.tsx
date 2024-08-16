import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { SelectChangeEvent } from '@mui/material/Select';
import { unstable_useId as useId } from '@mui/utils';
import { styled } from '../../../utils/styled';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
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

const SingleSelectOperatorContainer = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  width: '100%',
  [`& button`]: {
    margin: 'auto 0px 5px 5px',
  },
});

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps &
  TextFieldProps & {
    clearButton?: React.ReactNode | null;
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (for example `isEmpty`)
     */
    isFilterActive?: boolean;
    type?: 'singleSelect';
  };

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    placeholder,
    tabIndex,
    label: labelProp,
    variant = 'standard',
    isFilterActive,
    clearButton,
    InputLabelProps,
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
    (event: SelectChangeEvent<any>) => {
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

  const label = labelProp ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <SingleSelectOperatorContainer>
      <rootProps.slots.baseFormControl fullWidth>
        <rootProps.slots.baseInputLabel
          {...rootProps.slotProps?.baseInputLabel}
          id={labelId}
          htmlFor={id}
          shrink
          variant={variant}
        >
          {label}
        </rootProps.slots.baseInputLabel>
        <rootProps.slots.baseSelect
          id={id}
          label={label}
          labelId={labelId}
          value={filterValue}
          onChange={onFilterChange}
          variant={variant}
          type={type || 'text'}
          inputProps={{
            tabIndex,
            ref: focusElementRef,
            placeholder: placeholder ?? apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
          }}
          native={isSelectNative}
          notched={variant === 'outlined' ? true : undefined}
          {
            ...(others as any) /* FIXME: typing error */
          }
          {...rootProps.slotProps?.baseSelect}
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
      </rootProps.slots.baseFormControl>
      {clearButton}
    </SingleSelectOperatorContainer>
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
  clearButton: PropTypes.node,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
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
} as any;

export { GridFilterInputSingleSelect };
