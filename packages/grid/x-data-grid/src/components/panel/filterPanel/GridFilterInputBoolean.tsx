import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export function GridFilterInputBoolean(props: GridFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, apiRef, focusElementRef, ...others } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const rootProps = useGridRootProps();

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

  return (
    <rootProps.slots.baseTextField
      // TODO: use baseSelect slot
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      value={filterValueState}
      onChange={onFilterChange}
      select
      variant="standard"
      SelectProps={{
        native: isSelectNative,
        displayEmpty: true,
        ...rootProps.slotProps?.baseSelect,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      {...others}
      {...rootProps.slotProps?.baseTextField}
    >
      <rootProps.slots.baseSelectOption {...baseSelectOptionProps} native={isSelectNative} value="">
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
    </rootProps.slots.baseTextField>
  );
}
