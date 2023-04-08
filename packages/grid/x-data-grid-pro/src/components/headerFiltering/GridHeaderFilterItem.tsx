import * as React from 'react';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import {
  GridFilterItem,
  useGridSelector,
  gridFilterModelSelector,
  useGridRootProps,
  getGridFilter,
  GridFilterOperator,
  GridHeaderFilterEventLookup,
  GridColDef,
  gridVisibleColumnFieldsSelector,
  getDataGridUtilityClass,
} from '@mui/x-data-grid';
import {
  GridStateColDef,
  useGridPrivateApiContext,
  unstable_gridHeaderFilteringEditFieldSelector,
  unstable_gridHeaderFilteringMenuSelector,
  isNavigationKey,
} from '@mui/x-data-grid/internals';
import { GridHeaderFilterAdorment } from './GridHeaderFilterAdorment';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { OPERATOR_LABEL_MAPPING, NO_INPUT_OPERATORS, TYPES_WITH_NO_FILTER_CELL } from './constants';

interface GridHeaderFilterItemProps
  extends Pick<GridStateColDef, 'headerClassName'> {
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
}

type OwnerState = DataGridProProcessedProps & GridHeaderFilterItemProps;

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

const GridHeaderFilterItem = React.forwardRef<HTMLDivElement, GridHeaderFilterItemProps>(
  (props, ref) => {
    const {
      colIndex,
      height,
      hasFocus,
      headerFilterComponent,
      filterOperators,
      width,
      headerClassName,
      colDef,
      headerFilterMenuRef,
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
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const item = React.useMemo(
      () =>
        filterModel?.items.find((i) => i.field === colDef.field && i.operator !== 'isAnyOf') ??
        getGridFilter(colDef as any),
      [filterModel?.items, colDef],
    );

    const currentOperator = filterOperators![0];

    const InputComponent =
      (colDef.type && TYPES_WITH_NO_FILTER_CELL.includes(colDef.type)) || !colDef.filterable
        ? null
        : currentOperator!.InputComponent;

    const applyFilterChanges = React.useCallback(
      (updatedItem: GridFilterItem) => {
        apiRef.current.upsertFilterItem(updatedItem);
      },
      [apiRef],
    );

    React.useLayoutEffect(() => {
      if (hasFocus && !isMenuOpen) {
        let focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
        if (isEditing && InputComponent) {
          focusableElement = inputRef.current;
        }
        const elementToFocus = focusableElement || cellRef.current;
        elementToFocus?.focus();
      }
    }, [InputComponent, apiRef, hasFocus, isEditing, isMenuOpen]);

    const onKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isMenuOpen || isNavigationKey(event.key)) {
          return;
        }
        if (isEditing) {
          switch (event.key) {
            case 'Escape':
              apiRef.current.stopHeaderFilterEditMode();
              break;
            case 'Enter':
              apiRef.current.stopHeaderFilterEditMode();
              break;
            case 'Tab': {
              const fieldToFocus = columnFields[colIndex + (event.shiftKey ? -1 : 1)] ?? null;

              if (fieldToFocus) {
                apiRef.current.startHeaderFilterEditMode(fieldToFocus);
                apiRef.current.setColumnHeaderFilterFocus(fieldToFocus, event);
              }
              break;
            }
            default:
              break;
          }
          return;
        }
        switch (event.key) {
          case 'Escape':
            break;
          case 'Enter':
            if (event.metaKey || event.ctrlKey) {
              headerFilterMenuRef.current = buttonRef.current;
              apiRef.current.showHeaderFilterMenu(colDef.field);
              break;
            }
            apiRef.current.startHeaderFilterEditMode(colDef.field);
            break;

          default:
            if (
              event.metaKey ||
              event.ctrlKey ||
              event.altKey ||
              event.shiftKey ||
              event.key === 'Tab'
            ) {
              break;
            }
            apiRef.current.startHeaderFilterEditMode(colDef.field);
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
          apiRef.current.startHeaderFilterEditMode(colDef.field);
          apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
        }
      },
      [apiRef, colDef.field, hasFocus],
    );

    const mouseEventsHandlers = React.useMemo(
      () => ({
        onKeyDown: publish('headerFilterKeyDown', onKeyDown),
        onFocus: publish('headerFilterFocus'),
        onBlur: publish('headerFilterBlur'),
        onClick: publish('headerFilterClick', onClick),
        onDoubleClick: publish('headerFilterDoubleClick'),
      }),
      [onClick, onKeyDown, publish],
    );

    const ownerState = {
      ...rootProps,
      colDef,
    };

    const classes = useUtilityClasses(ownerState as OwnerState);

    const isNoInputOperator = NO_INPUT_OPERATORS[colDef.type!]?.includes(item.operator);
    const isFilterActive = hasFocus || Boolean(item?.value) || isNoInputOperator;

    const placeholder = apiRef.current.getLocaleText('columnMenuFilter');

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
        {InputComponent && !headerFilterComponent ? (
          <InputComponent
            apiRef={apiRef}
            item={item}
            inputRef={inputRef}
            applyValue={applyFilterChanges}
            onFocus={() => {
              apiRef.current.startHeaderFilterEditMode(colDef.field);
            }}
            onBlur={() => {
              apiRef.current.stopHeaderFilterEditMode();
            }}
            fullWidth
            placeholder={placeholder}
            label={isFilterActive ? OPERATOR_LABEL_MAPPING[item.operator] : ' '}
            {...currentOperator?.InputComponentProps}
            InputProps={{
              disabled: isNoInputOperator,
              value: isNoInputOperator ? '' : undefined,
              componentsProps: {
                input: {
                  'tab-index': -1,
                },
              },
              startAdornment: isFilterActive ? (
                <GridHeaderFilterAdorment
                  operators={filterOperators!}
                  item={item}
                  field={colDef.field}
                  applyFilterChanges={applyFilterChanges}
                  headerFilterMenuRef={headerFilterMenuRef}
                  buttonRef={buttonRef}
                />
              ) : null,
              ...currentOperator?.InputComponentProps?.InputProps,
            }}
          />
        ) : null}
      </div>
    );
  },
);

export { GridHeaderFilterItem };
