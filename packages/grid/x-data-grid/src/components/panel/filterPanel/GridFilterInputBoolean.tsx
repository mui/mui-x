import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export function GridFilterInputBoolean(props: GridFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, apiRef, focusElementRef, ...others } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const rootProps = useGridRootProps();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;
  const OptionComponent = isSelectNative ? 'option' : MenuItem;

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
      <OptionComponent value="">{apiRef.current.getLocaleText('filterValueAny')}</OptionComponent>
      <OptionComponent value="true">
        {apiRef.current.getLocaleText('filterValueTrue')}
      </OptionComponent>
      <OptionComponent value="false">
        {apiRef.current.getLocaleText('filterValueFalse')}
      </OptionComponent>
    </rootProps.slots.baseTextField>
  );
}
