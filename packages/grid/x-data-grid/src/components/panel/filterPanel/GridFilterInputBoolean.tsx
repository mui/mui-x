import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export function GridFilterInputBoolean(props: GridFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, apiRef, focusElementRef, ...others } = props;
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

  const label = apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <React.Fragment>
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
        inputProps={{ ref: focusElementRef }}
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
    </React.Fragment>
  );
}
