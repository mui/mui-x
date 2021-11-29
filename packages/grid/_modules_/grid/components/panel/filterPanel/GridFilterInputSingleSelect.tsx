import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridApi } from '../../../models/api/gridApi';

const renderSingleSelectOptions = (
  { valueOptions, valueFormatter, field }: GridColDef,
  api: GridApi,
) => {
  const iterableColumnValues =
    typeof valueOptions === 'function'
      ? ['', ...valueOptions({ field })]
      : ['', ...(valueOptions || [])];

  return iterableColumnValues.map((option) =>
    typeof option === 'object' ? (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ) : (
      <option key={option} value={option}>
        {valueFormatter && option !== '' ? valueFormatter({ value: option, field, api }) : option}
      </option>
    ),
  );
};

export type GridFilterInputSingleSelectProps = GridFilterInputValueProps &
  TextFieldProps & { type?: 'singleSelect' };

function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps) {
  const { item, applyValue, type, apiRef, focusElementRef, ...others } = props;
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const id = useId();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;
      // NativeSelect casts the value to a string.
      const column = apiRef.current.getColumn(item.columnField);
      const columnValueOptions =
        typeof column.valueOptions === 'function'
          ? column.valueOptions({ field: column.field })
          : column.valueOptions;
      value = columnValueOptions
        .map((option) => (typeof option === 'object' ? option.value : option))
        .find((optionValue) => String(optionValue) === value);

      setFilterValueState(String(value));
      applyValue({ ...item, value });
    },
    [apiRef, applyValue, item],
  );

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);

  return (
    <TextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      type={type || 'text'}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      select
      SelectProps={{
        native: true,
      }}
      {...others}
    >
      {renderSingleSelectOptions(apiRef.current.getColumn(item.columnField), apiRef.current)}
    </TextField>
  );
}

GridFilterInputSingleSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any.isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputSingleSelect };
