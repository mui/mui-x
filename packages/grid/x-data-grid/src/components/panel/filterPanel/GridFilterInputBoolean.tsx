import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

interface SelectOptionProps {
  isNative: boolean;
  children: React.ReactNode;
  value: string;
}

const SelectOption = ({ isNative, children, value, ...props }: SelectOptionProps) =>
  isNative ? (
    <option value={value} {...props}>
      {children}
    </option>
  ) : (
    <MenuItem value={value} {...props}>
      {children}
    </MenuItem>
  );

export function GridFilterInputBoolean(props: GridFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, apiRef, focusElementRef, ...others } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const rootProps = useGridRootProps();

  const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;

  const onFilterChange = React.useCallback(
    (event) => {
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
    <rootProps.components.BaseTextField
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      select
      SelectProps={{
        native: isSelectNative,
        displayEmpty: true,
        ...rootProps.componentsProps?.baseSelect,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      {...others}
      {...rootProps.componentsProps?.baseTextField}
    >
      <SelectOption isNative={isSelectNative} value="">
        {apiRef.current.getLocaleText('filterValueAny')}
      </SelectOption>
      <SelectOption isNative={isSelectNative} value="true">
        {apiRef.current.getLocaleText('filterValueTrue')}
      </SelectOption>
      <SelectOption isNative={isSelectNative} value="false">
        {apiRef.current.getLocaleText('filterValueFalse')}
      </SelectOption>
    </rootProps.components.BaseTextField>
  );
}
