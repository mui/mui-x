import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { useTimeout } from '../../../hooks/utils/useTimeout';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridFilterInputDateProps = GridFilterInputValueProps &
  TextFieldProps & {
    type?: 'date' | 'datetime-local';
    clearButton?: React.ReactNode | null;
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (e.g. `isEmpty`)
     */
    isFilterActive?: boolean;
  };

function GridFilterInputDate(props: GridFilterInputDateProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    InputProps,
    isFilterActive,
    clearButton,
    tabIndex,
    disabled,
    ...other
  } = props;
  const filterTimeout = useTimeout();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFilterValueState(String(value));

      setIsApplying(true);
      filterTimeout.start(rootProps.filterDebounceMs, () => {
        applyValue({ ...item, value });
        setIsApplying(false);
      });
    },
    [applyValue, item, rootProps.filterDebounceMs, filterTimeout],
  );

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);

  return (
    <rootProps.slots.baseTextField
      fullWidth
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      type={type || 'text'}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      InputProps={{
        ...(applying || clearButton
          ? {
              endAdornment: applying ? (
                <rootProps.slots.loadIcon fontSize="small" color="action" />
              ) : (
                clearButton
              ),
            }
          : {}),
        disabled,
        ...InputProps,
        inputProps: {
          max: type === 'datetime-local' ? '9999-12-31T23:59' : '9999-12-31',
          tabIndex,
          ...InputProps?.inputProps,
        },
      }}
      {...other}
      {...rootProps.slotProps?.baseTextField}
    />
  );
}

GridFilterInputDate.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  clearButton: PropTypes.node,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (e.g. `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputDate };
