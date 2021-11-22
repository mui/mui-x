import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridLoadIcon } from '../../icons/index';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';

export interface GridTypeFilterInputDateProps extends GridFilterInputValueProps {
  type?: 'date' | 'datetime-local';
}

export const SUBMIT_FILTER_STROKE_TIME = 500;

function GridFilterInputDate(props: GridTypeFilterInputDateProps & TextFieldProps) {
  const { item, applyValue, type, apiRef, focusElementRef, ...others } = props;

  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();

  const onFilterChange = React.useCallback(
    (event) => {
      const value = event.target.value;

      clearTimeout(filterTimeout.current);
      setFilterValueState(String(value));

      setIsApplying(true);
      filterTimeout.current = setTimeout(() => {
        applyValue({ ...item, value });
        setIsApplying(false);
      }, SUBMIT_FILTER_STROKE_TIME);
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
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
      inputRef={focusElementRef}
      {...others}
    />
  );
}

GridFilterInputDate.propTypes = {
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

export { GridFilterInputDate };
