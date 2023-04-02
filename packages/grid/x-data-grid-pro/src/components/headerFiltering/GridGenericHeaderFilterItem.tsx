import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import {
  GridFilterItem,
  useGridSelector,
  gridFilterModelSelector,
  useGridRootProps,
  getGridFilter,
  GridColumnHeaderEventLookup,
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
  classes: Record<'root' | 'titleContainer' | 'titleContainerContent', string>;
  colIndex: number;
  height: number;
  sortIndex?: number;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  disableReorder?: boolean;
  headerFilterComponent?: React.ReactNode;
  width: number;
  label: string;
  colDef: GridColDef;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
}

type OwnerState = DataGridProProcessedProps;

const FilterFormValueInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})<{ ownerState: OwnerState }>({ width: '100%' });

function GridGenericHeaderFilterItem(props: GridGenericColumnHeaderItemProps) {
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
    colDef.type !== 'checkboxSelection' ? currentOperator?.InputComponent : null;

  const applyFilterChanges = React.useCallback(
    (updatedItem: GridFilterItem) => {
      apiRef.current.upsertFilterItem(updatedItem);
    },
    [apiRef],
  );

  React.useEffect(() => {
    if (hasFocus && cellRef.current) {
      cellRef.current.focus();
    }
  }, [hasFocus]);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      cellRef.current?.focus();
      inputRef.current?.blur();
    }
  }, [isEditing]);

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
    (eventName: keyof GridColumnHeaderEventLookup, propHandler: React.EventHandler<any>) =>
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

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish('columnHeaderFilterKeyDown', onKeyDown),
      onClick: (event: React.MouseEvent) => {
        if (!hasFocus) {
          apiRef.current.startHeaderFilterEditMode(colDef.field);
          apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
          headerFilterMenuRef.current = buttonRef.current;
        }
      },
    }),
    [apiRef, colDef.field, hasFocus, headerFilterMenuRef, onKeyDown, publish],
  );

  const isNoInputOperator = noInputOperators[colDef.type!]?.includes(item.operator);
  const isFilterActive = hasFocus || Boolean(item?.value) || isNoInputOperator;

  return (
    <div
      className={clsx(classes.root, headerClassName)}
      ref={cellRef}
      style={{
        height,
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
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
        {InputComponent ? (
          <InputComponent
            apiRef={apiRef}
            item={item}
            inputRef={inputRef}
            applyValue={applyFilterChanges}
            onFocus={() => {
              apiRef.current.startHeaderFilterEditMode(colDef.field);
              if (!hasFocus) {
                apiRef.current.setColumnHeaderFilterFocus(colDef.field);
              }
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
}

export { GridGenericHeaderFilterItem };
