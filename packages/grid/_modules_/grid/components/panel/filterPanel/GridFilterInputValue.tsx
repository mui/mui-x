import * as React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import { GridLoadIcon } from '../../icons/index';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridColDef } from '../../../models/colDef/gridColDef';

const renderSelectOptions = ({ valueOptions }: GridColDef) =>
  valueOptions!.map((option) =>
    typeof option === 'string' ? (
      <option key={option} value={option}>
        {option}
      </option>
    ) : (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )
  );

export const SUBMIT_FILTER_STROKE_TIME = 500;

export interface GridTypeFilterInputValueProps extends GridFilterInputValueProps {
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'select';
}

export function GridFilterInputValue(props: GridTypeFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, type, apiRef, ...others } = props;
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const selectProps: TextFieldProps =
    type === 'select'
      ? {
          select: true,
          SelectProps: {
            native: true,
          },
          children: renderSelectOptions(apiRef.current.getColumn(item.columnField)),
        }
      : {};

  const onFilterChange = React.useCallback(
    (event) => {
      clearTimeout(filterTimeout.current);
      const value = event.target.value;
      setFilterValueState(value);
      setIsApplying(true);
      filterTimeout.current = setTimeout(() => {
        applyValue({ ...item, value });
        setIsApplying(false);
      }, SUBMIT_FILTER_STROKE_TIME);
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    setFilterValueState(item.value || '');
  }, [item.value]);

  const InputProps = applying ? { endAdornment: <GridLoadIcon /> } : others.InputProps;

  return (
    <TextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      type={type || 'text'}
      variant="standard"
      InputProps={InputProps}
      InputLabelProps={{
        shrink: true,
      }}
      {...selectProps}
      {...others}
    />
  );
}
