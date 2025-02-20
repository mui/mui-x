import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
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
  gridClasses,
} from '@mui/x-data-grid';
import {
  PinnedColumnPosition,
  GridStateColDef,
  GridFilterInputValueProps,
  useGridPrivateApiContext,
  gridHeaderFilteringEditFieldSelector,
  gridHeaderFilteringMenuSelector,
  isNavigationKey,
  attachPinnedStyle,
  vars,
} from '@mui/x-data-grid/internals';
import { useRtl } from '@mui/system/RtlProvider';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { inputBaseClasses } from '@mui/material/InputBase';
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
  '& input[type="number"], & input[type="date"], & input[type="datetime-local"]': {
    '&[value=""]:not(:focus)': {
      color: 'transparent',
    },
  },
  [`& .${inputBaseClasses.input}`]: {
    fontSize: '14px',
  },
  [`.${gridClasses['root--densityCompact']} & .${inputBaseClasses.input}`]: {
    paddingTop: vars.spacing(0.5),
    paddingBottom: vars.spacing(0.5),
    height: 23,
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
      'columnHeader--filter',
      colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
      colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
      colDef.headerAlign === 'right' && 'columnHeader--alignRight',
      'withBorderColor',
      showRightBorder && 'columnHeader--withRightBorder',
      showLeftBorder && 'columnHeader--withLeftBorder',
      pinnedPosition === PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
      pinnedPosition === PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
    ],
    input: ['columnHeaderFilterInput'],
    operatorLabel: ['columnHeaderFilterOperatorLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const DEFAULT_INPUT_COMPONENTS: {
  [key in GridColType]: React.JSXElementConstructor<GridFilterInputValueProps> | null;
} = {
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
    showClearIcon = false,
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
      ? (currentOperator.InputComponent ?? DEFAULT_INPUT_COMPONENTS[colDef.type as GridColType])
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
      elementToFocus?.focus();
      if (apiRef.current.columnHeadersContainerRef.current) {
        apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
      }
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

  const label =
    currentOperator.headerLabel ??
    apiRef.current.getLocaleText(
      `headerFilterOperator${capitalize(item.operator)}` as 'headerFilterOperatorContains',
    );

  const isNoInputOperator = currentOperator.requiresFilterValue === false;
  const isApplied = item?.value !== undefined || isNoInputOperator;
  const isFilterActive = isApplied || hasFocus;

  const headerFilterMenu = (
    <GridHeaderFilterMenuContainer
      operators={filterOperators}
      item={item}
      field={colDef.field}
      disabled={isFilterReadOnly}
      applyFilterChanges={apiRef.current.upsertFilterItem}
      headerFilterMenuRef={headerFilterMenuRef}
      buttonRef={buttonRef}
      showClearItem={!showClearIcon && isApplied}
      clearFilterItem={clearFilterItem}
    />
  );

  const clearButton =
    showClearIcon && isApplied ? (
      <GridHeaderFilterClearButton onClick={clearFilterItem} disabled={isFilterReadOnly} />
    ) : null;

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
      {headerFilterComponent === undefined ? (
        <React.Fragment>
          {isNoInputOperator ? (
            <React.Fragment>
              <OperatorLabel className={classes.operatorLabel}>{label}</OperatorLabel>
              {clearButton}
              {headerFilterMenu}
            </React.Fragment>
          ) : null}
          {InputComponent && !isNoInputOperator ? (
            <StyledInputComponent
              as={InputComponent}
              className={classes.input}
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
              isFilterActive={isFilterActive}
              headerFilterMenu={headerFilterMenu}
              clearButton={clearButton}
              disabled={isFilterReadOnly || isNoInputOperator}
              tabIndex={-1}
              slotProps={{
                root: {
                  size: 'small',
                  label: capitalize(label),
                  placeholder: '',
                } as any,
              }}
              {...(isNoInputOperator ? { value: '' } : {})}
              {...currentOperator?.InputComponentProps}
              {...InputComponentProps}
            />
          ) : null}
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
  InputComponentProps: PropTypes.shape({
    apiRef: PropTypes.shape({
      current: PropTypes.object.isRequired,
    }),
    applyValue: PropTypes.func,
    className: PropTypes.string,
    clearButton: PropTypes.node,
    disabled: PropTypes.bool,
    focusElementRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.any.isRequired,
      }),
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
    isFilterActive: PropTypes.bool,
    item: PropTypes.shape({
      field: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      operator: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    slotProps: PropTypes.object,
    tabIndex: PropTypes.number,
  }),
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
