import * as React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { LoadIcon } from '../../icons/index';
import { FilterInputValueProps } from './FilterInputValueProps';

const SUBMIT_FILTER_STROKE_TIME = 500;

export interface TypeFilterInputValueProps extends FilterInputValueProps {
  type?: 'text' | 'number' | 'date' | 'datetime-local';
}

export function FilterInputValue(props: TypeFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, type, ...others } = props;
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const [applying, setIsApplying] = React.useState(false);

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

  const InputProps = applying ? { endAdornment: <LoadIcon /> } : others.InputProps;

  return (
    <TextField
      label={'Value'}
      placeholder={'Filter value'}
      value={filterValueState}
      onChange={onFilterChange}
      type={type || 'text'}
      variant="standard"
      InputProps={InputProps}
      InputLabelProps={{
        shrink: true,
      }}
      {...others}
    />
  );
}
