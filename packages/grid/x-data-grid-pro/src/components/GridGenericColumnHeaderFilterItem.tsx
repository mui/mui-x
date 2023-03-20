import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import {
  GridFilterItem,
  useGridSelector,
  gridFilterModelSelector,
  useGridRootProps,
  getGridFilter,
  GridColumnHeaderEventLookup,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { GridStateColDef, useGridPrivateApiContext } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

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
  colType: string;
  field: string;
}

const OPERATOR_LABEL_MAPPING: { [key: string]: string } = {
  contains: 'Contains',
  equals: 'Equals',
  '=': 'Equals',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  is: 'Is',
  isNot: 'Is not',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
  isIn: 'Is in',
  isNotIn: 'Is not in',
  isLessThan: 'Is less than',
  isLessThanOrEqual: 'Is less than or equal to',
  isGreaterThan: 'Is greater than',
  isGreaterThanOrEqual: 'Is greater than or equal to',
  isBetween: 'Is between',
  isNotBetween: 'Is not between',
  isAnyOf: 'Is any of',
};

const OPERATOR_SYMBOL_MAPPING: { [key: string]: string } = {
  contains: '∋',
  equals: '=',
  '=': '=',
  startsWith: '⊃',
  endsWith: '⊂',
  is: '=',
  isNot: '≠',
  isEmpty: '∅',
  isNotEmpty: '∉',
  isIn: '∈',
  isNotIn: '∉',
  isLessThan: '<',
  isLessThanOrEqual: '≤',
  isGreaterThan: '>',
  isGreaterThanOrEqual: '≥',
  isBetween: '∈',
  isNotBetween: '∉',
  isAnyOf: '∈',
};

type OwnerState = DataGridProProcessedProps;

function AdormentMenu(props: {
  operator: string;
  operators: GridFilterOperator<any, any, any>[];
  item: GridFilterItem;
  applyFilterChanges: (item: GridFilterItem) => void;
}) {
  const { operator, operators, item, applyFilterChanges } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <InputAdornment position="start" onClick={handleClick}>
        <IconButton size="small">{operator ? OPERATOR_SYMBOL_MAPPING[operator] : ''}</IconButton>
      </InputAdornment>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {operators.map((op) => (
          <MenuItem
            onClick={() => {
              applyFilterChanges({ ...item, operator: op.value });
              handleClose();
            }}
          >
            <ListItemIcon>{OPERATOR_SYMBOL_MAPPING[op.value]}</ListItemIcon>
            <ListItemText>{OPERATOR_LABEL_MAPPING[op.value]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

const disabledOperators = ['isEmpty', 'isNotEmpty'];

const FilterFormValueInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput,
})<{ ownerState: OwnerState }>({ width: '100%' });

function GridGenericColumnHeaderFilterItem(props: GridGenericColumnHeaderItemProps) {
  const {
    classes,
    colType,
    colIndex,
    height,
    hasFocus,
    tabIndex,
    headerFilterComponent,
    description,
    width,
    headerClassName,
    label: propLabel,
    field,
    resizable,
    ...other
  } = props;

  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const cellRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentColumn = field ? apiRef.current.getColumn(field) : null;
  const [isEditing, setEditing] = React.useState(false);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const item = React.useMemo(
    () => filterModel?.items.find((i) => i.field === field) ?? getGridFilter(currentColumn as any),
    [filterModel?.items, currentColumn, field],
  );
  const currentOperator = currentColumn?.filterOperators![0];

  const InputComponent = colType !== 'checkboxSelection' ? currentOperator?.InputComponent : null;

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

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (isEditing) {
            cellRef.current?.focus();
          }
          break;
        case 'Enter':
          if (isEditing) {
            cellRef.current?.focus();
            break;
          }
          inputRef.current?.focus();
          break;
        default:
          // assuming some other key was pressed
          inputRef.current?.focus();
          break;
      }
    },
    [isEditing],
  );

  const publish = React.useCallback(
    (eventName: keyof GridColumnHeaderEventLookup, propHandler: React.EventHandler<any>) =>
      (event: React.SyntheticEvent) => {
        apiRef.current.publishEvent(
          eventName,
          apiRef.current.getColumnHeaderParams(field),
          event as any,
        );
        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, field],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish('columnHeaderFilterKeyDown', onKeyDown),
      onClick: (event: React.MouseEvent) => {
        if (!hasFocus) {
          apiRef.current.setColumnHeaderFilterFocus(field, event);
        }
      },
    }),
    [apiRef, field, hasFocus, onKeyDown, publish],
  );

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
            variant="standard"
            placeholder={item?.value ? '' : 'Filter'}
            onFocus={() => setEditing(true)}
            onBlur={() => setEditing(false)}
            label={
              hasFocus || item?.value || disabledOperators.includes(item.operator)
                ? OPERATOR_LABEL_MAPPING[item.operator]
                : ' '
            }
            fullWidth
            disabled={disabledOperators.includes(item.operator)}
            InputProps={{
              startAdornment:
                hasFocus || item?.value || disabledOperators.includes(item.operator) ? (
                  <AdormentMenu
                    operators={currentColumn?.filterOperators!}
                    operator={item.operator}
                    item={item}
                    applyFilterChanges={applyFilterChanges}
                  />
                ) : null,
            }}
          />
        ) : null}
      </FilterFormValueInput>
    </div>
  );
}

export { GridGenericColumnHeaderFilterItem };
