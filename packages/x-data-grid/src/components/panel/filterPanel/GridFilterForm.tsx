'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { GridFilterFormBase } from './GridFilterFormBase';
import type { GridFilterFormProps } from './GridFilterFormBase';

const GridFilterForm = forwardRef<HTMLDivElement, GridFilterFormProps>(
  function GridFilterForm(props, ref) {
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

    return <GridFilterFormBase filterModel={filterModel} {...props} ref={ref} />;
  },
);

GridFilterForm.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: PropTypes.func.isRequired,
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLogicOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: PropTypes.func.isRequired,
  /**
   * @ignore - do not document.
   */
  children: PropTypes.node,
  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps: PropTypes.any,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: PropTypes.func.isRequired,
  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps: PropTypes.any,
  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator: PropTypes.bool,
  /**
   * Allows to filter the columns displayed in the filter form.
   * @param {FilterColumnsArgs} args The columns of the grid and name of field.
   * @returns {GridColDef['field'][]} The filtered fields array.
   */
  filterColumns: PropTypes.func,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: PropTypes.bool.isRequired,
  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  logicOperatorInputProps: PropTypes.any,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps: PropTypes.any,
  /**
   * `true` if the filter is disabled/read only.
   * i.e. `colDef.fiterable = false` but passed in `filterModel`
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators: PropTypes.bool,
  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps: PropTypes.any,
} as any;

/**
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 *
 * API:
 * - [GridFilterForm API](https://mui.com/x/api/data-grid/grid-filter-form/)
 */
export { GridFilterForm };
