import * as React from 'react';
import clsx from 'clsx';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import {
  GridFilterItem,
  useGridSelector,
  gridFilterActiveItemsLookupSelector,
  gridFilterModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import { GridStateColDef } from '@mui/x-data-grid/internals';

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

const SYMBOL_MAPPING: { [key: string]: string } = {
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
};

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

  const apiRef = useGridApiContext();
  const currentColumn = field ? apiRef.current.getColumn(field) : null;
  const operator = currentColumn?.filterOperators![0] ?? null;
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const [label, setLabel] = React.useState('Filter');
  const [filterValue, setFilterValue] = React.useState('');
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  React.useEffect(() => {
    const filtersForCurrentColumn = filterColumnLookup[field];
    if (filtersForCurrentColumn && filtersForCurrentColumn.length > 0) {
      const filterForCurrentOperator =
        filtersForCurrentColumn.find((filter) => filter.value === operator?.value) ||
        filtersForCurrentColumn[0];
      setFilterValue(filterForCurrentOperator.value);
    } else {
      setFilterValue('');
      setLabel('Filter');
    }
  }, [field, filterColumnLookup, operator?.value]);

  const applyFilter = React.useCallback(
    (event: any) => {
      setFilterValue(event.target.value);
      if (operator) {
        const item: GridFilterItem = {
          value: event.target.value,
          field,
          operator: operator.value,
        };
        if (filterModel.items.length > 0) {
          apiRef.current.upsertFilterItems(filterModel.items.filter((i) => i.field !== field));
        }
        apiRef.current.upsertFilterItems([
          ...filterModel.items.filter(({ field: colField }) => colField !== item.field),
          item,
        ]);
      }
    },
    [apiRef, field, filterModel.items, operator],
  );

  return (
    <div
      className={clsx(classes.root, headerClassName)}
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
    >
      <div className={classes.titleContainer}>
        <div className={classes.titleContainerContent}>
          {headerFilterComponent !== undefined
            ? headerFilterComponent
            : colType !== 'checkboxSelection' &&
              operator && (
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-amount">{label}</InputLabel>
                  <Input
                    id="standard-adornment-amount"
                    startAdornment={
                      label !== 'Filter' ? (
                        <InputAdornment position="start">
                          {operator?.value
                            ? SYMBOL_MAPPING[operator.value]
                            : operator.value ?? operator.value}
                        </InputAdornment>
                      ) : null
                    }
                    value={filterValue}
                    onChange={applyFilter}
                    onFocus={() => setLabel(operator.value)}
                    onBlur={() => {
                      if (filterValue === '') {
                        setLabel('Filter');
                      }
                    }}
                  />
                </FormControl>
              )}
        </div>
      </div>
    </div>
  );
}

export { GridGenericColumnHeaderFilterItem };
