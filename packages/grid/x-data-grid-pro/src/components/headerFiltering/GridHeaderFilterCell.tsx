import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import {
  GridFilterItem,
  GridFilterOperator,
  GridHeaderFilterEventLookup,
  GridColDef,
  gridVisibleColumnFieldsSelector,
  getDataGridUtilityClass,
  GridTypeFilterInputValueProps,
  GridFilterInputDateProps,
  GridFilterInputSingleSelectProps,
  GridFilterInputBooleanProps,
} from '@mui/x-data-grid';
import {
  GridStateColDef,
  useGridPrivateApiContext,
  unstable_gridHeaderFilteringEditFieldSelector,
  unstable_gridHeaderFilteringMenuSelector,
  isNavigationKey,
} from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { GridHeaderFilterAdornment } from './GridHeaderFilterAdornment';
import { GridHeaderFilterClearButton } from './GridHeaderFilterClearButton';
import { OPERATOR_LABEL_MAPPING } from './constants';

type GridHeaderFilterCellConditionalProps =
  | {
      operator: 'contains' | 'startsWith' | 'endsWith' | 'equals';
      colType: 'string';
      InputComponentProps?: Partial<GridTypeFilterInputValueProps>;
    }
  | {
      operator: 'isEmpty' | 'isNotEmpty';
      colType: string;
      InputComponentProps?: null;
    }
  | {
      operator: '=' | '!=' | '>' | '>=' | '<' | '<=';
      colType: 'number';
      InputComponentProps?: Partial<GridTypeFilterInputValueProps>;
    }
  | {
      operator: 'is' | 'not' | 'after' | 'onOrAfter' | 'before' | 'onOrBefore';
      colType: 'date' | 'dateTime';
      InputComponentProps?: Partial<GridFilterInputDateProps>;
    }
  | {
      operator: 'is' | 'not';
      colType: 'singleSelect';
      InputComponentProps?: Partial<GridFilterInputSingleSelectProps>;
    }
  | {
      colType: 'boolean';
      InputComponentProps?: Partial<GridFilterInputBooleanProps>;
    }
  | {
      // user defined operators
      colType: GridColDef['type'];
      operator: GridFilterOperator['value'];
      InputComponentProps?: {
        [key: string]: any;
      };
    };

export type GridHeaderFilterCellOverridableProps = Pick<GridStateColDef, 'headerClassName'> &
  GridHeaderFilterCellConditionalProps & { showClearIcon?: boolean };

export type GridHeaderFilterCellProps = GridHeaderFilterCellOverridableProps & {
  colIndex: number;
  height: number;
  sortIndex?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  headerFilterComponent?: React.ReactNode;
  filterOperators?: GridFilterOperator[];
  width: number;
  colDef: GridColDef;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
  item: GridFilterItem;
};

type OwnerState = DataGridProProcessedProps & GridHeaderFilterCellProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { colDef, classes, showColumnVerticalBorder } = ownerState;

  const slots = {
    root: [
      'columnHeader',
      colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'columnHeader--alignRight',
      'withBorderColor',
      showColumnVerticalBorder && 'columnHeader--withRightBorder',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridHeaderFilterCell = React.forwardRef<HTMLDivElement, GridHeaderFilterCellProps>(
  (props, ref) => {
    const {
      colIndex,
      colType,
      height,
      hasFocus,
      headerFilterComponent,
      filterOperators,
      width,
      headerClassName,
      colDef,
      item,
      headerFilterMenuRef,
      InputComponentProps,
      showClearIcon = true,
      ...other
    } = props;

    const apiRef = useGridPrivateApiContext();
    const columnFields = gridVisibleColumnFieldsSelector(apiRef);
    const rootProps = useGridRootProps();
    const cellRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(ref, cellRef);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const isEditing = unstable_gridHeaderFilteringEditFieldSelector(apiRef) === colDef.field;
    const isMenuOpen = unstable_gridHeaderFilteringMenuSelector(apiRef) === colDef.field;

    const currentOperator = filterOperators![0];

    const InputComponent = colDef.filterable ? currentOperator!.InputComponent : null;

    const applyFilterChanges = React.useCallback(
      (updatedItem: GridFilterItem) => {
        if (item.value && !updatedItem.value) {
          apiRef.current.deleteFilterItem(updatedItem);
          return;
        }
        apiRef.current.upsertFilterItem(updatedItem);
      },
      [apiRef, item],
    );

    const clearFilterItem = React.useCallback(() => {
      apiRef.current.deleteFilterItem(item);
    }, [apiRef, item]);

    React.useLayoutEffect(() => {
      if (hasFocus && !isMenuOpen) {
        let focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
        if (isEditing && InputComponent) {
          focusableElement = inputRef.current;
        }
        const elementToFocus = focusableElement || cellRef.current;
        elementToFocus?.focus();
        apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
      }
    }, [InputComponent, apiRef, hasFocus, isEditing, isMenuOpen]);

    const onKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isMenuOpen || isNavigationKey(event.key)) {
          return;
        }
        switch (event.key) {
          case 'Escape':
            if (isEditing) {
              apiRef.current.stopHeaderFilterEditMode();
            }
            break;
          case 'Enter':
            if (isEditing) {
              apiRef.current.stopHeaderFilterEditMode();
              break;
            }
            if (event.metaKey || event.ctrlKey) {
              headerFilterMenuRef.current = buttonRef.current;
              apiRef.current.showHeaderFilterMenu(colDef.field);
              break;
            }
            apiRef.current.startHeaderFilterEditMode(colDef.field);
            break;
          case 'Tab': {
            if (isEditing) {
              const fieldToFocus = columnFields[colIndex + (event.shiftKey ? -1 : 1)] ?? null;

              if (fieldToFocus) {
                apiRef.current.startHeaderFilterEditMode(fieldToFocus);
                apiRef.current.setColumnHeaderFilterFocus(fieldToFocus, event);
              }
            }
            break;
          }
          default:
            if (isEditing || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
              break;
            }
            apiRef.current.startHeaderFilterEditMode(colDef.field);
            break;
        }
      },
      [apiRef, colDef.field, colIndex, columnFields, headerFilterMenuRef, isEditing, isMenuOpen],
    );

    const publish = React.useCallback(
      (eventName: keyof GridHeaderFilterEventLookup, propHandler?: React.EventHandler<any>) =>
        (event: React.SyntheticEvent) => {
          apiRef.current.publishEvent(
            eventName,
            apiRef.current.getColumnHeaderParams(colDef.field),
            event as any,
          );

          if (propHandler) {
            propHandler(event);
          }
        },
      [apiRef, colDef.field],
    );

    const onClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (!hasFocus) {
          if (inputRef.current) {
            inputRef.current.focus();
          }
          apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
        }
      },
      [apiRef, colDef.field, hasFocus],
    );

    const mouseEventsHandlers = React.useMemo(
      () => ({
        onKeyDown: publish('headerFilterKeyDown', onKeyDown),
        onClick: publish('headerFilterClick', onClick),
        onBlur: publish('headerFilterBlur'),
        onFocus: publish('headerFilterFocus'),
      }),
      [onClick, onKeyDown, publish],
    );

    const ownerState = {
      ...rootProps,
      colDef,
    };

    const classes = useUtilityClasses(ownerState as OwnerState);

    const isNoInputOperator =
      filterOperators?.find(({ value }) => item.operator === value)?.requiresFilterValue === false;

    const isApplied = Boolean(item?.value) || isNoInputOperator;
    const label =
      OPERATOR_LABEL_MAPPING[item.operator] ??
      apiRef.current.getLocaleText(
        `filterOperator${capitalize(item.operator)}` as 'filterOperatorContains',
      );

    const isFilterActive = isApplied || hasFocus;

    return (
      <div
        className={clsx(classes.root, headerClassName)}
        ref={handleRef}
        style={{
          height,
          width,
          minWidth: width,
          maxWidth: width,
        }}
        role="columnheader"
        aria-colindex={colIndex + 1}
        aria-label={headerFilterComponent == null ? colDef.headerName ?? colDef.field : undefined}
        {...other}
        {...mouseEventsHandlers}
      >
        {headerFilterComponent}
        {InputComponent && headerFilterComponent === undefined ? (
          <InputComponent
            apiRef={apiRef}
            item={item}
            inputRef={inputRef}
            applyValue={applyFilterChanges}
            onFocus={() => apiRef.current.startHeaderFilterEditMode(colDef.field)}
            onBlur={() => apiRef.current.stopHeaderFilterEditMode()}
            placeholder={apiRef.current.getLocaleText('columnMenuFilter')}
            label={isFilterActive ? capitalize(label) : ' '}
            isFilterActive={isFilterActive}
            headerFilterMenu={
              <GridHeaderFilterAdornment
                operators={filterOperators!}
                item={item}
                field={colDef.field}
                applyFilterChanges={applyFilterChanges}
                headerFilterMenuRef={headerFilterMenuRef}
                buttonRef={buttonRef}
              />
            }
            clearButton={
              showClearIcon && isApplied ? (
                <GridHeaderFilterClearButton onClick={clearFilterItem} />
              ) : null
            }
            disabled={isNoInputOperator}
            tabIndex={-1}
            {...currentOperator?.InputComponentProps}
            {...InputComponentProps}
          />
        ) : null}
      </div>
    );
  },
);

GridHeaderFilterCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  colType: PropTypes.string,
  filterOperators: PropTypes.arrayOf(
    PropTypes.shape({
      getApplyFilterFn: PropTypes.func.isRequired,
      getValueAsString: PropTypes.func,
      InputComponent: PropTypes.elementType,
      InputComponentProps: PropTypes.object,
      label: PropTypes.string,
      requiresFilterValue: PropTypes.bool,
      value: PropTypes.string.isRequired,
    }),
  ),
  hasFocus: PropTypes.bool,
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  headerFilterComponent: PropTypes.node,
  headerFilterMenuRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  height: PropTypes.number.isRequired,
  InputComponentProps: PropTypes.object,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  showClearIcon: PropTypes.bool,
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  width: PropTypes.number.isRequired,
} as any;

export { GridHeaderFilterCell };
