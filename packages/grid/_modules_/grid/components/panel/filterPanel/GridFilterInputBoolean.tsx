import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';

export const GridFilterInputBoolean = React.forwardRef(function GridFilterInputBoolean(
  props: GridFilterInputValueProps & TextFieldProps,
  ref: React.Ref<any>,
) {
  const { item, applyValue, apiRef, ...others } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');

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
    <TextField
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      select
      SelectProps={{
        native: true,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={ref}
      {...others}
    >
      <option value="">{apiRef.current.getLocaleText('filterValueAny')}</option>
      <option value="true">{apiRef.current.getLocaleText('filterValueTrue')}</option>
      <option value="false">{apiRef.current.getLocaleText('filterValueFalse')}</option>
    </TextField>
  );
});
