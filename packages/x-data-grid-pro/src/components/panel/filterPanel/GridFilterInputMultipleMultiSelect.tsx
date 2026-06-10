import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import type { GridMultiSelectColDef } from '@mui/x-data-grid';
import { useGridRootProps } from '@mui/x-data-grid';
import { getValueOptions, isMultiSelectColDef } from '@mui/x-data-grid/internals';
import type { SelectProps, GridFilterInputValueProps } from '@mui/x-data-grid/internals';

export type GridFilterInputMultipleMultiSelectProps = GridFilterInputValueProps<
  Omit<SelectProps, 'children'>
> & {
  type?: 'multiSelect';
};

function GridFilterInputMultipleMultiSelect(props: GridFilterInputMultipleMultiSelectProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    inputRef,
    tabIndex,
    isFilterActive,
    clearButton,
    headerFilterMenu,
    slotProps,
    ...other
  } = props;

  const id = useId();
  const labelId = useId();
  const rootProps = useGridRootProps();

  const resolvedColumn = apiRef.current.getColumn(item.field) as GridMultiSelectColDef | undefined;

  const getOptionValue = resolvedColumn!.getOptionValue!;
  const getOptionLabel = resolvedColumn!.getOptionLabel!;

  const resolvedValueOptions = React.useMemo(() => {
    return getValueOptions(resolvedColumn!) || [];
  }, [resolvedColumn]);

  const filterValues = React.useMemo(() => {
    if (!Array.isArray(item.value)) {
      return [];
    }
    return item.value.filter((val: any) =>
      resolvedValueOptions.some((option) => getOptionValue(option) === val),
    );
  }, [getOptionValue, item.value, resolvedValueOptions]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event.target.value;
      applyValue({ ...item, value: typeof value === 'string' ? value.split(',') : value });
    },
    [applyValue, item],
  );

  if (!resolvedColumn || !isMultiSelectColDef(resolvedColumn)) {
    return null;
  }

  const label = slotProps?.root?.label ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <React.Fragment>
      <rootProps.slots.baseSelect
        fullWidth
        id={id}
        labelId={labelId}
        label={label}
        multiple
        value={filterValues}
        onChange={handleChange as any}
        renderValue={(selected: any[]) =>
          selected
            .map((val) => {
              const option = resolvedValueOptions.find((opt) => getOptionValue(opt) === val);
              return option ? getOptionLabel(option) : val;
            })
            .join(', ')
        }
        slotProps={{
          htmlInput: {
            tabIndex,
            ref: focusElementRef ?? inputRef,
            ...(slotProps?.root as any)?.slotProps?.htmlInput,
          },
        }}
        {...rootProps.slotProps?.baseSelect}
        {...other}
        {...slotProps?.root}
      >
        {resolvedValueOptions.map((option) => {
          const value = getOptionValue(option);
          return (
            <rootProps.slots.baseSelectOption
              {...rootProps.slotProps?.baseSelectOption}
              native={false}
              key={value}
              value={value}
            >
              {getOptionLabel(option)}
            </rootProps.slots.baseSelectOption>
          );
        })}
      </rootProps.slots.baseSelect>
      {headerFilterMenu}
      {clearButton}
    </React.Fragment>
  );
}

GridFilterInputMultipleMultiSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  clearButton: PropTypes.node,
  disabled: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  headerFilterMenu: PropTypes.node,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: (props, propName) => {
        if (props[propName] == null) {
          return null;
        }
        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
          return new Error(`Expected prop '${propName}' to be of type Element`);
        }
        return null;
      },
    }),
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
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  slotProps: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['multiSelect']),
} as any;

export { GridFilterInputMultipleMultiSelect };
