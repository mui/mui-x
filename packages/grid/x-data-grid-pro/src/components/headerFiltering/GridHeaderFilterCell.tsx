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
import { GridHeaderFilterMenuContainer } from './GridHeaderFilterMenuContainer';
import { GridHeaderFilterClearButton } from './GridHeaderFilterClearButton';

export interface GridHeaderFilterCellProps extends Pick<GridStateColDef, 'headerClassName'> {
  colIndex: number;
  height: number;
  sortIndex?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
  filterOperators?: GridFilterOperator[];
  width: number;
  colDef: GridColDef;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
  item: GridFilterItem;
  showClearIcon?: boolean;
  InputComponentProps: GridFilterOperator['InputComponentProps'];
}

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

const dateSx = {
  [`& input[value=""]:not(:focus)`]: { color: 'transparent' },
};

const GridHeaderFilterCell = React.forwardRef<HTMLDivElement, GridHeaderFilterCellProps>(
  (props, ref) => {
    const {
      colIndex,
      height,
      hasFocus,
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

    let headerFilterComponent: React.ReactNode;
    if (colDef.renderHeaderFilter) {
      headerFilterComponent = colDef.renderHeaderFilter(props);
    }

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

    const onMouseDown = React.useCallback(
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
        onClick: publish('headerFilterClick'),
        onMouseDown: publish('headerFilterMouseDown', onMouseDown),
        onBlur: publish('headerFilterBlur'),
      }),
      [onMouseDown, onKeyDown, publish],
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
      currentOperator.headerLabel ??
      apiRef.current.getLocaleText(
        `headerFilterOperator${capitalize(item.operator)}` as 'headerFilterOperatorContains',
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
          <React.Fragment>
            <InputComponent
              apiRef={apiRef}
              item={item}
              inputRef={inputRef}
              applyValue={applyFilterChanges}
              onFocus={() => apiRef.current.startHeaderFilterEditMode(colDef.field)}
              onBlur={() => apiRef.current.stopHeaderFilterEditMode()}
              label={capitalize(label)}
              placeholder=""
              isFilterActive={isFilterActive}
              clearButton={
                showClearIcon && isApplied ? (
                  <GridHeaderFilterClearButton onClick={clearFilterItem} />
                ) : null
              }
              disabled={isNoInputOperator}
              tabIndex={-1}
              InputLabelProps={null}
              sx={colDef.type === 'date' || colDef.type === 'dateTime' ? dateSx : undefined}
              {...(isNoInputOperator ? { value: '' } : {})}
              {...currentOperator?.InputComponentProps}
              {...InputComponentProps}
            />
            <GridHeaderFilterMenuContainer
              operators={filterOperators!}
              item={item}
              field={colDef.field}
              applyFilterChanges={applyFilterChanges}
              headerFilterMenuRef={headerFilterMenuRef}
              buttonRef={buttonRef}
            />
          </React.Fragment>
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
  filterOperators: PropTypes.arrayOf(
    PropTypes.shape({
      getApplyFilterFn: PropTypes.func.isRequired,
      getApplyFilterFnV7: PropTypes.func,
      getValueAsString: PropTypes.func,
      headerLabel: PropTypes.string,
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
