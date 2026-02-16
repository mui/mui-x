import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import {
  GridFilterItem,
  GridFilterOperator,
  GridHeaderFilterEventLookup,
  GridColDef,
  gridVisibleColumnFieldsSelector,
  getDataGridUtilityClass,
  useGridSelector,
  GridFilterInputValue,
  GridFilterInputDate,
  GridFilterInputBoolean,
  GridColType,
  GridFilterInputSingleSelect,
  gridFilterModelSelector,
  gridFilterableColumnLookupSelector,
} from '@mui/x-data-grid';
import {
  PinnedColumnPosition,
  GridStateColDef,
  useGridPrivateApiContext,
  gridHeaderFilteringEditFieldSelector,
  gridHeaderFilteringMenuSelector,
  isNavigationKey,
  attachPinnedStyle,
} from '@mui/x-data-grid/internals';
import { useRtl } from '@mui/system/RtlProvider';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { GridHeaderFilterMenuContainer } from './GridHeaderFilterMenuContainer';
import { GridHeaderFilterClearButton } from './GridHeaderFilterClearButton';

export interface GridRenderHeaderFilterProps extends GridHeaderFilterCellProps {
  inputRef: React.RefObject<unknown>;
}

export interface GridHeaderFilterCellProps extends Pick<GridStateColDef, 'headerClassName'> {
  colIndex: number;
  height: number;
  sortIndex?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  width: number;
  colDef: GridColDef;
  headerFilterMenuRef: React.RefObject<HTMLButtonElement | null>;
  item: GridFilterItem;
  showClearIcon?: boolean;
  InputComponentProps: GridFilterOperator['InputComponentProps'];
  pinnedPosition?: PinnedColumnPosition;
  pinnedOffset?: number;
  style?: React.CSSProperties;
  showLeftBorder: boolean;
  showRightBorder: boolean;
}

type OwnerState = DataGridProProcessedProps & {
  colDef: GridColDef;
  pinnedPosition?: PinnedColumnPosition;
  showRightBorder: boolean;
  showLeftBorder: boolean;
};

const StyledInputComponent = styled(GridFilterInputValue, {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderFilterInput',
})({
  flex: 1,
  marginRight: vars.spacing(0.5),
  marginBottom: vars.spacing(-0.25),
  '& input[type="date"], & input[type="datetime-local"]': {
    '&[value=""]:not(:focus)': {
      color: 'transparent',
    },
  },
  [`& .${inputBaseClasses.input}`]: {
    fontSize: '14px',
  },
  [`.${gridClasses['root--densityCompact']} & .${inputBaseClasses.input}`]: {
    paddingTop: vars.spacing(0.25),
    paddingBottom: vars.spacing(0.25),
    height: 20,
  },
});

const OperatorLabel = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderFilterOperatorLabel',
})({
  flex: 1,
  marginRight: vars.spacing(0.5),
  color: vars.colors.foreground.muted,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const useUtilityClasses = (ownerState: OwnerState) => {
  const { colDef, classes, showRightBorder, showLeftBorder, pinnedPosition } = ownerState;

  const slots = {
    root: [
      'columnHeader',
      colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'columnHeader--alignRight',
      'withBorderColor',
      showRightBorder && 'columnHeader--withRightBorder',
      showLeftBorder && 'columnHeader--withLeftBorder',
      pinnedPosition === PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
      pinnedPosition === PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const emptyFieldSx = {
  [`& input[value=""]:not(:focus)`]: { color: 'transparent' },
};
const defaultInputComponents: { [key in GridColType]: React.JSXElementConstructor<any> | null } = {
  string: GridFilterInputValue,
  number: GridFilterInputValue,
  date: GridFilterInputDate,
  dateTime: GridFilterInputDate,
  boolean: GridFilterInputBoolean,
  singleSelect: GridFilterInputSingleSelect,
  actions: null,
  custom: null,
};
const GridHeaderFilterCell = forwardRef<HTMLDivElement, GridHeaderFilterCellProps>((props, ref) => {
  const {
    colIndex,
    height,
    hasFocus,
    width,
    headerClassName,
    colDef,
    item,
    headerFilterMenuRef,
    InputComponentProps,
    showClearIcon = true,
    pinnedPosition,
    pinnedOffset,
    style: styleProp,
    showLeftBorder,
    showRightBorder,
    ...other
  } = props;

  const apiRef = useGridPrivateApiContext();
  const isRtl = useRtl();
  const columnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const rootProps = useGridRootProps();
  const cellRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, cellRef);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const editingField = useGridSelector(apiRef, gridHeaderFilteringEditFieldSelector);
  const isEditing = editingField === colDef.field;

  const menuOpenField = useGridSelector(apiRef, gridHeaderFilteringMenuSelector);
  const isMenuOpen = menuOpenField === colDef.field;

  // TODO: Support for `isAnyOf` operator
  const filterOperators = React.useMemo(() => {
    if (!colDef.filterOperators) {
      return [];
    }
    return colDef.filterOperators.filter((operator) => operator.value !== 'isAnyOf');
  }, [colDef.filterOperators]);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterableColumnsLookup = useGridSelector(apiRef, gridFilterableColumnLookupSelector);

  const isFilterReadOnly = React.useMemo(() => {
    if (!filterModel?.items.length) {
      return false;
    }
    const filterModelItem = filterModel.items.find((it) => it.field === colDef.field);
    return filterModelItem ? !filterableColumnsLookup[filterModelItem.field] : false;
  }, [colDef.field, filterModel, filterableColumnsLookup]);

  const currentOperator = React.useMemo(
    () =>
      filterOperators.find((operator) => operator.value === item.operator) ?? filterOperators![0],
    [item.operator, filterOperators],
  );

  const InputComponent =
    colDef.filterable || isFilterReadOnly
      ? (currentOperator.InputComponent ?? defaultInputComponents[colDef.type as GridColType])
      : null;

  const clearFilterItem = React.useCallback(() => {
    apiRef.current.deleteFilterItem(item);
  }, [apiRef, item]);

  let headerFilterComponent: React.ReactNode;
  if (colDef.renderHeaderFilter) {
    headerFilterComponent = colDef.renderHeaderFilter({ ...props, inputRef });
  }

  React.useLayoutEffect(() => {
    if (hasFocus && !isMenuOpen) {
      let focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      if (isEditing && InputComponent) {
        focusableElement = inputRef.current;
      }
      const elementToFocus = focusableElement || cellRef.current;

      const scrollPosition = apiRef.current.getScrollPosition();
      elementToFocus?.focus();
      apiRef.current.scroll(scrollPosition);
    }
  }, [InputComponent, apiRef, hasFocus, isEditing, isMenuOpen]);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (isMenuOpen || isNavigationKey(event.key) || isFilterReadOnly) {
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
            if (!event.defaultPrevented) {
              apiRef.current.stopHeaderFilterEditMode();
              break;
            }
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
    [
      apiRef,
      colDef.field,
      colIndex,
      columnFields,
      headerFilterMenuRef,
      isEditing,
      isFilterReadOnly,
      isMenuOpen,
    ],
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

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (!hasFocus) {
        if (inputRef.current?.contains?.(event.target as HTMLElement)) {
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
      onClick: publish('headerFilterClick'),
      onMouseDown: publish('headerFilterMouseDown', onMouseDown),
      onBlur: publish('headerFilterBlur'),
    }),
    [onMouseDown, onKeyDown, publish],
  );

  const ownerState: OwnerState = {
    ...rootProps,
    pinnedPosition,
    colDef,
    showLeftBorder,
    showRightBorder,
  };

  const classes = useUtilityClasses(ownerState as OwnerState);

  const isNoInputOperator = currentOperator.requiresFilterValue === false;

  const isApplied = item?.value !== undefined || isNoInputOperator;

  const label =
    currentOperator.headerLabel ??
    apiRef.current.getLocaleText(
      `headerFilterOperator${capitalize(item.operator)}` as 'headerFilterOperatorContains',
    );

  const isFilterActive = isApplied || hasFocus;

  return (
    <div
      className={clsx(classes.root, headerClassName)}
      style={attachPinnedStyle(
        {
          height,
          width,
          ...styleProp,
        },
        isRtl,
        pinnedPosition,
        pinnedOffset,
      )}
      role="columnheader"
      aria-colindex={colIndex + 1}
      aria-label={headerFilterComponent == null ? (colDef.headerName ?? colDef.field) : undefined}
      {...other}
      {...mouseEventsHandlers}
      ref={handleRef}
    >
      {headerFilterComponent}
      {InputComponent && headerFilterComponent === undefined ? (
        <React.Fragment>
          <InputComponent
            apiRef={apiRef}
            item={item}
            inputRef={inputRef}
            applyValue={apiRef.current.upsertFilterItem}
            onFocus={() => apiRef.current.startHeaderFilterEditMode(colDef.field)}
            onBlur={(event: React.FocusEvent) => {
              apiRef.current.stopHeaderFilterEditMode();
              // Blurring an input element should reset focus state only if `relatedTarget` is not the header filter cell
              if (!event.relatedTarget?.className.includes('columnHeader')) {
                apiRef.current.setState((state) => ({
                  ...state,
                  focus: {
                    cell: null,
                    columnHeader: null,
                    columnHeaderFilter: null,
                    columnGroupHeader: null,
                  },
                }));
              }
            }}
            label={capitalize(label)}
            placeholder=""
            isFilterActive={isFilterActive}
            clearButton={
              showClearIcon && isApplied ? (
                <GridHeaderFilterClearButton
                  onClick={clearFilterItem}
                  disabled={isFilterReadOnly}
                />
              ) : null
            }
            disabled={isFilterReadOnly || isNoInputOperator}
            tabIndex={-1}
            InputLabelProps={null}
            sx={
              colDef.type === 'date' || colDef.type === 'dateTime' || colDef.type === 'number'
                ? emptyFieldSx
                : undefined
            }
            {...(isNoInputOperator ? { value: '' } : {})}
            {...currentOperator?.InputComponentProps}
            {...InputComponentProps}
          />
          <GridHeaderFilterMenuContainer
            operators={filterOperators!}
            item={item}
            field={colDef.field}
            disabled={isFilterReadOnly}
            applyFilterChanges={apiRef.current.upsertFilterItem}
            headerFilterMenuRef={headerFilterMenuRef}
            buttonRef={buttonRef}
          />
        </React.Fragment>
      ) : null}
    </div>
  );
});

GridHeaderFilterCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  hasFocus: PropTypes.bool,
  /**
   * Class name added to the column header cell.
   */
  headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
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
  pinnedOffset: PropTypes.number,
  pinnedPosition: PropTypes.oneOf([0, 1, 2, 3]),
  showClearIcon: PropTypes.bool,
  showLeftBorder: PropTypes.bool.isRequired,
  showRightBorder: PropTypes.bool.isRequired,
  sortIndex: PropTypes.number,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  width: PropTypes.number.isRequired,
} as any;

const Memoized = fastMemo(GridHeaderFilterCell);

export { Memoized as GridHeaderFilterCell };
