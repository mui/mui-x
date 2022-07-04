import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { capitalize, unstable_useId as useId } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { gridFilterableColumnDefinitionsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import { GridColDef } from '../../../models/colDef/gridColDef';

export interface GridFilterFormProps {
  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: GridFilterItem;
  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: boolean;
  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators?: boolean;
  /**
   * The current logic operator applied.
   */
  multiFilterOperator?: GridLinkOperator;
  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator?: boolean;
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef?: React.Ref<any>;
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: (item: GridFilterItem) => void;
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLinkOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: (operator: GridLinkOperator) => void;
  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: (item: GridFilterItem) => void;
  /**
   * Sets the available logic operators.
   * @default [GridLinkOperator.And, GridLinkOperator.Or]
   */
  linkOperators?: GridLinkOperator[];
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort?: 'asc' | 'desc';
  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps?: any;
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  linkOperatorInputProps?: any;
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps?: any;
  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps?: any;
  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps?: any;
}

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['filterForm'],
    deleteIcon: ['filterFormDeleteIcon'],
    linkOperatorInput: ['filterFormLinkOperatorInput'],
    columnInput: ['filterFormColumnInput'],
    operatorInput: ['filterFormOperatorInput'],
    valueInput: ['filterFormValueInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridFilterFormRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterForm',
  overridesResolver: (props, styles) => styles.filterForm,
})(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
}));

const FilterFormDeleteIcon = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormDeleteIcon',
  overridesResolver: (_, styles) => styles.filterFormDeleteIcon,
})(({ theme }) => ({
  flexShrink: 0,
  justifyContent: 'flex-end',
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.2),
}));

const FilterFormLinkOperatorInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormLinkOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormLinkOperatorInput,
})({
  minWidth: 55,
  marginRight: 5,
  justifyContent: 'end',
});

const FilterFormColumnInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
  overridesResolver: (_, styles) => styles.filterFormColumnInput,
})({ width: 150 });

const FilterFormOperatorInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormOperatorInput,
})({ width: 120 });

const FilterFormValueInput = styled(FormControl, {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})({ width: 190 });

const getLinkOperatorLocaleKey = (linkOperator: GridLinkOperator) => {
  switch (linkOperator) {
    case GridLinkOperator.And:
      return 'filterPanelOperatorAnd';
    case GridLinkOperator.Or:
      return 'filterPanelOperatorOr';
    default:
      throw new Error('MUI: Invalid `linkOperator` property in the `GridFilterPanel`.');
  }
};

const getColumnLabel = (col: GridColDef) => col.headerName || col.field;

const collator = new Intl.Collator();

const GridFilterForm = React.forwardRef<HTMLDivElement, GridFilterFormProps>(
  function GridFilterForm(props, ref) {
    const {
      item,
      hasMultipleFilters,
      deleteFilter,
      applyFilterChanges,
      multiFilterOperator,
      showMultiFilterOperators,
      disableMultiFilterOperator,
      applyMultiFilterOperatorChanges,
      focusElementRef,
      linkOperators = [GridLinkOperator.And, GridLinkOperator.Or],
      columnsSort,
      deleteIconProps = {},
      linkOperatorInputProps = {},
      operatorInputProps = {},
      columnInputProps = {},
      valueInputProps = {},
      children,
      ...other
    } = props;
    const apiRef = useGridApiContext();
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const columnSelectId = useId();
    const columnSelectLabelId = useId();
    const operatorSelectId = useId();
    const operatorSelectLabelId = useId();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const valueRef = React.useRef<any>(null);
    const filterSelectorRef = React.useRef<HTMLInputElement>(null);

    const hasLinkOperatorColumn: boolean = hasMultipleFilters && linkOperators.length > 0;

    const baseFormControlProps = rootProps.componentsProps?.baseFormControl || {};

    const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
    const isBaseSelectNative = baseSelectProps.native ?? true;
    const OptionComponent = isBaseSelectNative ? 'option' : MenuItem;

    const { InputComponentProps, ...valueInputPropsOther } = valueInputProps;

    const sortedFilterableColumns = React.useMemo(() => {
      switch (columnsSort) {
        case 'asc':
          return filterableColumns.sort((a, b) =>
            collator.compare(getColumnLabel(a), getColumnLabel(b)),
          );

        case 'desc':
          return filterableColumns.sort(
            (a, b) => -collator.compare(getColumnLabel(a), getColumnLabel(b)),
          );

        default:
          return filterableColumns;
      }
    }, [filterableColumns, columnsSort]);

    const currentColumn = item.columnField ? apiRef.current.getColumn(item.columnField) : null;

    const currentOperator = React.useMemo(() => {
      if (!item.operatorValue || !currentColumn) {
        return null;
      }

      return currentColumn.filterOperators?.find(
        (operator) => operator.value === item.operatorValue,
      );
    }, [item, currentColumn]);

    const changeColumn = React.useCallback(
      (event: SelectChangeEvent) => {
        const columnField = event.target.value as string;
        const column = apiRef.current.getColumn(columnField)!;

        if (column.field === currentColumn!.field) {
          // column did not change
          return;
        }

        // try to keep the same operator when column change
        const newOperator =
          column.filterOperators!.find((operator) => operator.value === item.operatorValue) ||
          column.filterOperators![0];

        // Erase filter value if the input component is modified
        const eraseItemValue =
          !newOperator.InputComponent ||
          newOperator.InputComponent !== currentOperator?.InputComponent;

        applyFilterChanges({
          ...item,
          columnField,
          operatorValue: newOperator.value,
          value: eraseItemValue ? undefined : item.value,
        });
      },
      [apiRef, applyFilterChanges, item, currentColumn, currentOperator],
    );

    const changeOperator = React.useCallback(
      (event: SelectChangeEvent) => {
        const operatorValue = event.target.value as string;

        const newOperator = currentColumn?.filterOperators!.find(
          (operator) => operator.value === operatorValue,
        );

        const eraseItemValue =
          !newOperator?.InputComponent ||
          newOperator?.InputComponent !== currentOperator?.InputComponent;

        applyFilterChanges({
          ...item,
          operatorValue,
          value: eraseItemValue ? undefined : item.value,
        });
      },
      [applyFilterChanges, item, currentColumn, currentOperator],
    );

    const changeLinkOperator = React.useCallback(
      (event: SelectChangeEvent) => {
        const linkOperator =
          (event.target.value as string) === GridLinkOperator.And.toString()
            ? GridLinkOperator.And
            : GridLinkOperator.Or;
        applyMultiFilterOperatorChanges(linkOperator);
      },
      [applyMultiFilterOperatorChanges],
    );

    const handleDeleteFilter = () => {
      if (rootProps.disableMultipleColumnsFiltering) {
        if (item.value === undefined) {
          deleteFilter(item);
        } else {
          // TODO v6: simplify the behavior by always remove the filter form
          applyFilterChanges({ ...item, value: undefined });
        }
      } else {
        deleteFilter(item);
      }
    };

    React.useImperativeHandle(
      focusElementRef,
      () => ({
        focus: () => {
          if (currentOperator?.InputComponent) {
            valueRef?.current?.focus();
          } else {
            filterSelectorRef.current!.focus();
          }
        },
      }),
      [currentOperator],
    );

    return (
      <GridFilterFormRoot ref={ref} className={classes.root} {...other}>
        <FilterFormDeleteIcon
          variant="standard"
          as={rootProps.components.BaseFormControl}
          {...baseFormControlProps}
          {...deleteIconProps}
          className={clsx(
            classes.deleteIcon,
            baseFormControlProps.className,
            deleteIconProps.className,
          )}
        >
          <IconButton
            aria-label={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
            title={apiRef.current.getLocaleText('filterPanelDeleteIconLabel')}
            onClick={handleDeleteFilter}
            size="small"
          >
            <rootProps.components.FilterPanelDeleteIcon fontSize="small" />
          </IconButton>
        </FilterFormDeleteIcon>
        <FilterFormLinkOperatorInput
          variant="standard"
          as={rootProps.components.BaseFormControl}
          {...baseFormControlProps}
          {...linkOperatorInputProps}
          sx={{
            display: hasLinkOperatorColumn ? 'flex' : 'none',
            visibility: showMultiFilterOperators ? 'visible' : 'hidden',
            ...(baseFormControlProps.sx || {}),
            ...(linkOperatorInputProps.sx || {}),
          }}
          className={clsx(
            classes.linkOperatorInput,
            baseFormControlProps.className,
            linkOperatorInputProps.className,
          )}
        >
          <rootProps.components.BaseSelect
            inputProps={{
              'aria-label': apiRef.current.getLocaleText('filterPanelLinkOperator'),
            }}
            value={multiFilterOperator}
            onChange={changeLinkOperator}
            disabled={!!disableMultiFilterOperator || linkOperators.length === 1}
            native={isBaseSelectNative}
            {...rootProps.componentsProps?.baseSelect}
          >
            {linkOperators.map((linkOperator) => (
              <OptionComponent key={linkOperator.toString()} value={linkOperator.toString()}>
                {apiRef.current.getLocaleText(getLinkOperatorLocaleKey(linkOperator))}
              </OptionComponent>
            ))}
          </rootProps.components.BaseSelect>
        </FilterFormLinkOperatorInput>
        <FilterFormColumnInput
          variant="standard"
          as={rootProps.components.BaseFormControl}
          {...baseFormControlProps}
          {...columnInputProps}
          className={clsx(
            classes.columnInput,
            baseFormControlProps.className,
            columnInputProps.className,
          )}
        >
          <InputLabel htmlFor={columnSelectId} id={columnSelectLabelId}>
            {apiRef.current.getLocaleText('filterPanelColumns')}
          </InputLabel>
          <rootProps.components.BaseSelect
            labelId={columnSelectLabelId}
            id={columnSelectId}
            label={apiRef.current.getLocaleText('filterPanelColumns')}
            value={item.columnField || ''}
            onChange={changeColumn}
            native={isBaseSelectNative}
            {...rootProps.componentsProps?.baseSelect}
          >
            {sortedFilterableColumns.map((col) => (
              <OptionComponent key={col.field} value={col.field}>
                {getColumnLabel(col)}
              </OptionComponent>
            ))}
          </rootProps.components.BaseSelect>
        </FilterFormColumnInput>
        <FilterFormOperatorInput
          variant="standard"
          as={rootProps.components.BaseFormControl}
          {...baseFormControlProps}
          {...operatorInputProps}
          className={clsx(
            classes.operatorInput,
            baseFormControlProps.className,
            operatorInputProps.className,
          )}
        >
          <InputLabel htmlFor={operatorSelectId} id={operatorSelectLabelId}>
            {apiRef.current.getLocaleText('filterPanelOperators')}
          </InputLabel>
          <rootProps.components.BaseSelect
            labelId={operatorSelectLabelId}
            label={apiRef.current.getLocaleText('filterPanelOperators')}
            id={operatorSelectId}
            value={item.operatorValue}
            onChange={changeOperator}
            native={isBaseSelectNative}
            inputRef={filterSelectorRef}
            {...rootProps.componentsProps?.baseSelect}
          >
            {currentColumn?.filterOperators?.map((operator) => (
              <OptionComponent key={operator.value} value={operator.value}>
                {operator.label ||
                  apiRef.current.getLocaleText(
                    `filterOperator${capitalize(operator.value)}` as GridTranslationKeys,
                  )}
              </OptionComponent>
            ))}
          </rootProps.components.BaseSelect>
        </FilterFormOperatorInput>
        <FilterFormValueInput
          variant="standard"
          as={rootProps.components.BaseFormControl}
          {...baseFormControlProps}
          {...valueInputPropsOther}
          className={clsx(
            classes.valueInput,
            baseFormControlProps.className,
            valueInputPropsOther.className,
          )}
        >
          {currentOperator?.InputComponent ? (
            <currentOperator.InputComponent
              apiRef={apiRef}
              item={item}
              applyValue={applyFilterChanges}
              focusElementRef={valueRef}
              {...currentOperator.InputComponentProps}
              {...InputComponentProps}
            />
          ) : null}
        </FilterFormValueInput>
      </GridFilterFormRoot>
    );
  },
);

GridFilterForm.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: PropTypes.func.isRequired,
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLinkOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: PropTypes.func.isRequired,
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
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  linkOperatorInputProps: PropTypes.any,
  /**
   * Sets the available logic operators.
   * @default [GridLinkOperator.And, GridLinkOperator.Or]
   */
  linkOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * The current logic operator applied.
   */
  multiFilterOperator: PropTypes.oneOf(['and', 'or']),
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps: PropTypes.any,
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

export { GridFilterForm };
