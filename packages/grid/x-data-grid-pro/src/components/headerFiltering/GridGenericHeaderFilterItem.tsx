import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import {
  GridFilterItem,
  useGridSelector,
  gridFilterModelSelector,
  useGridRootProps,
  getGridFilter,
  GridHeaderFilterEventLookup,
  GridColDef,
  gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid';
import {
  GridStateColDef,
  useGridPrivateApiContext,
  gridHeaderFilteringEditFieldSelector,
  gridHeaderFilteringMenuSelector,
  isNavigationKey,
} from '@mui/x-data-grid/internals';
import { GridHeaderFilterAdorment } from './GridHeaderFilterAdorment';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { OPERATOR_LABEL_MAPPING, noInputOperators } from './constants';

interface GridGenericColumnHeaderItemProps
  extends Pick<GridStateColDef, 'headerClassName' | 'description' | 'resizable'> {
  classes: Record<'root', string>;
  colIndex: number;
  height: number;
  sortIndex?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  headerFilterComponent?: React.ReactNode;
  width: number;
  label: string;
  colDef: GridColDef;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
}

type OwnerState = DataGridProProcessedProps;

const TYPES_WITH_NO_FILTER_CELL = ['actions', 'checkboxSelection'];

const FilterFormValueInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})<{ ownerState: OwnerState }>({ width: '100%' });

const GridGenericHeaderFilterItem = React.forwardRef<
  HTMLDivElement,
  GridGenericColumnHeaderItemProps
>((props, ref) => {
  const {
    classes,
    colIndex,
    height,
    hasFocus,
    tabIndex,
    headerFilterComponent,
    description,
    width,
    headerClassName,
    label: propLabel,
    colDef,
    resizable,
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

  const isEditing = gridHeaderFilteringEditFieldSelector(apiRef) === colDef.field;
  const isMenuOpen = gridHeaderFilteringMenuSelector(apiRef) === colDef.field;
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const item = React.useMemo(
    () => filterModel?.items.find((i) => i.field === colDef.field) ?? getGridFilter(colDef as any),
    [filterModel?.items, colDef],
  );
  const currentOperator = colDef?.filterOperators![0];

  const InputComponent =
    (colDef.type && TYPES_WITH_NO_FILTER_CELL.includes(colDef.type)) || !colDef.filterable
      ? null
      : currentOperator?.InputComponent;

  const applyFilterChanges = React.useCallback(
    (updatedItem: GridFilterItem) => {
      apiRef.current.upsertFilterItem(updatedItem);
    },
    [apiRef],
  );

  React.useLayoutEffect(() => {
    if (hasFocus) {
      let focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      if (isEditing && InputComponent) {
        focusableElement = inputRef.current;
      }
      const elementToFocus = focusableElement || cellRef.current;
      elementToFocus?.focus();
    }
  }, [InputComponent, apiRef, hasFocus, isEditing]);

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
      } else {
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

  const isNoInputOperator = noInputOperators[colDef.type!]?.includes(item.operator);
  const isFilterActive = hasFocus || Boolean(item?.value) || isNoInputOperator;

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
      role="gridcell"
      tabIndex={tabIndex}
      aria-colindex={colIndex + 1}
      aria-label={headerFilterComponent == null ? propLabel : undefined}
      {...other}
      {...mouseEventsHandlers}
    >
      <FilterFormValueInput
        as={rootProps.slots.baseFormControl}
        ownerState={rootProps as DataGridProProcessedProps}
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
            variant="standard"
            placeholder={item?.value ? '' : 'Filter'}
            label={isFilterActive ? OPERATOR_LABEL_MAPPING[item.operator] : ' '}
            fullWidth
            {...currentOperator?.InputComponentProps}
            InputProps={{
              disabled: isNoInputOperator,
              componentsProps: {
                input: {
                  tabIndex: -1,
                },
              },
              startAdornment: isFilterActive ? (
                <GridHeaderFilterAdorment
                  operators={colDef?.filterOperators!}
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
      </FilterFormValueInput>
    </div>
  );
});

export { GridGenericHeaderFilterItem };
