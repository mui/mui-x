import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridFilterInputBooleanProps = GridFilterInputValueProps &
  TextFieldProps & {
    headerFilterMenu?: React.ReactNode | null;
    isFilterActive?: boolean;
  };

function GridFilterInputBoolean(props: GridFilterInputBooleanProps) {
  const {
    item,
    applyValue,
    apiRef,
    focusElementRef,
    headerFilterMenu,
    isFilterActive,
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
        startAdornment={isFilterActive ? headerFilterMenu : null}
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
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputBoolean };
