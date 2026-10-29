'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import refType from '@mui/utils/refType';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridFilterItem } from '../../../models/gridFilterItem';
import type { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';

export interface GridFilterFormColumnInputProps {
  /**
   * The [[GridFilterItem]] of the filter form.
   */
  item: GridFilterItem;
  /**
   * The columns that the user can select, already filtered and sorted.
   */
  columns: GridStateColDef[];
  /**
   * The field of the selected column.
   * It is `undefined` if the current field is not in `columns`.
   */
  value: GridColDef['field'] | undefined;
  /**
   * Callback fired when the user selects a column.
   * @param {GridColDef['field']} field The field of the selected column.
   */
  onChange: (field: GridColDef['field']) => void;
  /**
   * If `true`, the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The CSS class of the input.
   */
  className?: string;
  /**
   * A ref allowing to set imperative focus.
   */
  focusElementRef?: React.Ref<any>;
}

type OwnerState = DataGridProcessedProps;

const FilterFormColumnInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
})<{ ownerState: OwnerState }>({ width: 150 });

export const getGridFilterFormColumnLabel = (col: GridColDef) => col.headerName || col.field;

function GridFilterFormColumnInput(props: GridFilterFormColumnInputProps) {
  const { item, columns, value, onChange, disabled, className, focusElementRef, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const columnSelectId = useId();
  const columnSelectLabelId = useId();

  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isBaseSelectNative = baseSelectProps.native ?? false;
  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

  const handleChange = (event: React.ChangeEvent<any>) => {
    onChange(event.target.value as string);
  };

  return (
    <FilterFormColumnInput
      as={rootProps.slots.baseSelect}
      // Props from `columnInputProps` go to the `baseSelect` slot.
      {...(other as any)}
      className={className}
      ownerState={rootProps}
      size="small"
      labelId={columnSelectLabelId}
      id={columnSelectId}
      label={apiRef.current.getLocaleText('filterPanelColumn')}
      value={value ?? ''}
      onChange={handleChange}
      native={isBaseSelectNative}
      disabled={disabled}
      inputRef={focusElementRef}
      {...rootProps.slotProps?.baseSelect}
    >
      {columns.map((col) => (
        <rootProps.slots.baseSelectOption
          {...baseSelectOptionProps}
          native={isBaseSelectNative}
          key={col.field}
          value={col.field}
        >
          {getGridFilterFormColumnLabel(col)}
        </rootProps.slots.baseSelectOption>
      ))}
    </FilterFormColumnInput>
  );
}

GridFilterFormColumnInput.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The CSS class of the input.
   */
  className: PropTypes.string,
  /**
   * The columns that the user can select, already filtered and sorted.
   */
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If `true`, the input is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * A ref allowing to set imperative focus.
   */
  focusElementRef: refType,
  /**
   * The [[GridFilterItem]] of the filter form.
   */
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  /**
   * Callback fired when the user selects a column.
   * @param {GridColDef['field']} field The field of the selected column.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * The field of the selected column.
   * It is `undefined` if the current field is not in `columns`.
   */
  value: PropTypes.string,
} as any;

export { GridFilterFormColumnInput };
