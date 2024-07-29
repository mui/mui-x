import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/utils';
import { useTimeout } from '../../../hooks/utils/useTimeout';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridTypeFilterInputValueProps = GridFilterInputValueProps &
  TextFieldProps & {
    type?: 'text' | 'number' | 'date' | 'datetime-local';
    clearButton?: React.ReactNode | null;
    /**
     * It is `true` if the filter either has a value or an operator with no value
     * required is selected (for example `isEmpty`)
     */
    isFilterActive?: boolean;
  };

type ItemPlusTag = GridFilterItem & { fromInput?: string };

function GridFilterInputValue(props: GridTypeFilterInputValueProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    tabIndex,
    disabled,
    isFilterActive,
    clearButton,
    InputProps,
    variant = 'standard',
    ...others
  } = props;
  const filterTimeout = useTimeout();
  const [filterValueState, setFilterValueState] = React.useState<string>(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFilterValueState(String(value));

      setIsApplying(true);
      filterTimeout.start(rootProps.filterDebounceMs, () => {
        const newItem = { ...item, value, fromInput: id! };
        applyValue(newItem);
        setIsApplying(false);
      });
    },
    [id, applyValue, item, rootProps.filterDebounceMs, filterTimeout],
  );

  React.useEffect(() => {
    const itemPlusTag = item as ItemPlusTag;
    if (itemPlusTag.fromInput !== id || item.value === undefined) {
      setFilterValueState(String(item.value ?? ''));
    }
  }, [id, item]);

  return (
    <rootProps.slots.baseTextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      variant={variant}
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
      {...others}
      {...rootProps.slotProps?.baseTextField}
    />
  );
}

GridFilterInputValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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
   * required is selected (for example `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
} as any;

export { GridFilterInputValue };
