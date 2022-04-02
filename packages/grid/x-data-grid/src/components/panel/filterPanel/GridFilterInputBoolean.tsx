import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

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

  if (isSelectNative) {
    return (
      <rootProps.components.BaseTextField
        label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        value={filterValueState}
        onChange={onFilterChange}
        variant="standard"
        select
        SelectProps={{
          native: true,
          ...rootProps.componentsProps?.baseSelect,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        inputRef={focusElementRef}
        {...others}
        {...rootProps.componentsProps?.baseTextField}
      >
        <option value="">{apiRef.current.getLocaleText('filterValueAny')}</option>
        <option value="true">{apiRef.current.getLocaleText('filterValueTrue')}</option>
        <option value="false">{apiRef.current.getLocaleText('filterValueFalse')}</option>
      </rootProps.components.BaseTextField>
    );
  }

  return (
    <rootProps.components.BaseTextField
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      select
      SelectProps={{
        displayEmpty: true,
        native: false,
        ...rootProps.componentsProps?.baseSelect,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      {...others}
      {...rootProps.componentsProps?.baseTextField}
    >
      <MenuItem value="">{apiRef.current.getLocaleText('filterValueAny')}</MenuItem>
      <MenuItem value="true">{apiRef.current.getLocaleText('filterValueTrue')}</MenuItem>
      <MenuItem value="false">{apiRef.current.getLocaleText('filterValueFalse')}</MenuItem>
    </rootProps.components.BaseTextField>
  );
}
