import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { refType, unstable_useId as useId } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridFilterInputBooleanProps = GridFilterInputValueProps &
  TextFieldProps & {
    clearButton?: React.ReactNode | null;
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (for example `isEmpty`)
     */
    isFilterActive?: boolean;
  };

const BooleanOperatorContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  [`& button`]: {
    margin: 'auto 0px 5px 5px',
  },
});

/**
 * Helper to convert a Boolean filter value to a string
 * representation that can be used with the select component.
 */
const booleanFilterValueToString = (value: boolean | null) =>
  !value && value !== false ? '' : String(value);

/**
 * Helper to convert the string values from the select component
 * to a boolean value that can be used in the filter model.
 */
const stringToBooleanFilterValue = (value: string) => (value === '' ? null : value === 'true');

function GridFilterInputBoolean(props: GridFilterInputBooleanProps) {
  const {
    item,
    applyValue,
    apiRef,
    focusElementRef,
    isFilterActive,
    clearButton,
    tabIndex,
    label: labelProp,
    variant = 'standard',
    InputLabelProps,
    ...others
  } = props;

  const [filterValueState, setFilterValueState] = React.useState(
    booleanFilterValueToString(item.value),
  );
  const rootProps = useGridRootProps();

  const labelId = useId();
  const selectId = useId();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? false;

  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFilterValueState(value);
      applyValue({
        ...item,
        // Convert the string select value to a boolean or null
        value: stringToBooleanFilterValue(value),
      });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    // Convert the boolean or null value to a string for the select component
    setFilterValueState(booleanFilterValueToString(item.value));
  }, [item.value]);

  const label = labelProp ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <BooleanOperatorContainer>
      <rootProps.slots.baseFormControl fullWidth>
        <rootProps.slots.baseInputLabel
          {...rootProps.slotProps?.baseInputLabel}
          id={labelId}
          shrink
          variant={variant}
        >
          {label}
        </rootProps.slots.baseInputLabel>
        <rootProps.slots.baseSelect
          labelId={labelId}
          id={selectId}
          label={label}
          value={filterValueState}
          onChange={onFilterChange}
          variant={variant}
          notched={variant === 'outlined' ? true : undefined}
          native={isSelectNative}
          displayEmpty
          inputProps={{ ref: focusElementRef, tabIndex }}
          {
            ...(others as any) /* FIXME: typing error */
          }
          {...baseSelectProps}
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
      </rootProps.slots.baseFormControl>
      {clearButton}
    </BooleanOperatorContainer>
  );
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
  clearButton: PropTypes.node,
  focusElementRef: refType,
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

export { GridFilterInputBoolean };
