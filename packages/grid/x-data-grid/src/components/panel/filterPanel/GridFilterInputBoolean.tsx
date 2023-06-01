import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridFilterInputBooleanProps = GridFilterInputValueProps &
  TextFieldProps & {
    clearButton?: React.ReactNode | null;
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (e.g. `isEmpty`)
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
    ...others
  } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const rootProps = useGridRootProps();

  const labelId = useId();
  const selectId = useId();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;

  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFilterValueState(value);
      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    setFilterValueState(item.value || '');
  }, [item.value]);

  const label = labelProp ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <BooleanOperatorContainer>
      <rootProps.slots.baseFormControl fullWidth>
        <rootProps.slots.baseInputLabel
          {...rootProps.slotProps?.baseInputLabel}
          id={labelId}
          shrink
          variant="standard"
        >
          {label}
        </rootProps.slots.baseInputLabel>
        <rootProps.slots.baseSelect
          labelId={labelId}
          id={selectId}
          label={label}
          value={filterValueState}
          onChange={onFilterChange}
          variant="standard"
          native={isSelectNative}
          displayEmpty
          inputProps={{ ref: focusElementRef, tabIndex }}
          {...others}
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  clearButton: PropTypes.node,
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (e.g. `isEmpty`)
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
