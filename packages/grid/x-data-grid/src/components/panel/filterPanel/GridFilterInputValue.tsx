import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { Theme } from '@mui/material/styles';
import { GridDensity } from '../../../models/gridDensity';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export const SUBMIT_FILTER_STROKE_TIME = 500;

export type GridTypeFilterInputValueProps = GridFilterInputValueProps &
  TextFieldProps & {
    type?: 'text' | 'number' | 'date' | 'datetime-local';
    clearButton?: React.ReactNode | null;
    gridDensity?: GridDensity;
  };

const compactDensitySx = (theme: Theme) => {
  return {
    [`& input`]: {
      fontSize: theme.typography.fontSize,
      padding: '0 0 2px',
    },
    [`& label`]: {
      fontSize: theme.typography.fontSize,
    },
  };
};
function GridFilterInputValue(props: GridTypeFilterInputValueProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    tabIndex,
    disabled,
    clearButton,
    InputProps,
    gridDensity,
    sx,
    ...others
  } = props;
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState<string>(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
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
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);

  return (
    <rootProps.slots.baseTextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      size={gridDensity === 'compact' ? 'small' : 'normal'}
      type={type || 'text'}
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
          tabIndex,
          ...InputProps?.inputProps,
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      sx={gridDensity === 'compact' ? [compactDensitySx, sx] : sx}
      {...others}
      {...rootProps.slotProps?.baseTextField}
    />
  );
}

GridFilterInputValue.propTypes = {
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
  gridDensity: PropTypes.oneOf(['comfortable', 'compact', 'standard']),
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputValue };
