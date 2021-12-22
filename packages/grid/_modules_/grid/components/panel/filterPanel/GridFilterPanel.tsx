import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridAddIcon } from '../../icons';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterForm, GridFilterFormProps } from './GridFilterForm';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { filterableGridColumnsSelector } from '../../../hooks/features/columns/gridColumnsSelector';

export interface GridFilterPanelProps
  extends Pick<
    GridFilterFormProps,
    | 'linkOperators'
    | 'columnsSort'
    | 'deleteIconContainerSx'
    | 'linkOperatorContainerSx'
    | 'columnContainerSx'
    | 'operatorContainerSx'
    | 'valueContainerSx'
  > {}

const defaultGridFilterPanelProps = {
  linkOperators: [GridLinkOperator.And, GridLinkOperator.Or],
  columnsSort: undefined,
  deleteIconContainerSx: {},
  linkOperatorContainerSx: {},
  columnContainerSx: {},
  operatorContainerSx: {},
  valueContainerSx: {},
};

function GridFilterPanel({
  linkOperators,
  columnsSort,
  deleteIconContainerSx,
  linkOperatorContainerSx,
  columnContainerSx,
  operatorContainerSx,
  valueContainerSx,
}: GridFilterPanelProps = defaultGridFilterPanelProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterableColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
  const lastFilterRef = React.useRef<any>(null);

  const applyFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef.current.upsertFilterItem(item);
    },
    [apiRef],
  );

  const applyFilterLinkOperator = React.useCallback(
    (operator: GridLinkOperator) => {
      apiRef.current.setFilterLinkOperator(operator);
    },
    [apiRef],
  );

  const getDefaultItem = React.useCallback((): GridFilterItem | null => {
    const firstColumnWithOperator = filterableColumns.find(
      (colDef) => colDef.filterOperators?.length,
    );

    if (!firstColumnWithOperator) {
      return null;
    }

    return {
      columnField: firstColumnWithOperator.field,
      operatorValue: firstColumnWithOperator.filterOperators![0].value,
      id: Math.round(Math.random() * 1e5),
    };
  }, [filterableColumns]);

  const items = React.useMemo<GridFilterItem[]>(() => {
    if (filterModel.items.length) {
      return filterModel.items;
    }

    const defaultItem = getDefaultItem();

    return defaultItem ? [defaultItem] : [];
  }, [filterModel.items, getDefaultItem]);

  const hasMultipleFilters = items.length > 1;

  const addNewFilter = () => {
    const defaultItem = getDefaultItem();
    if (!defaultItem) {
      return;
    }
    apiRef.current.setFilterModel({ ...filterModel, items: [...items, defaultItem] });
  };

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef.current.deleteFilterItem(item);
    },
    [apiRef],
  );

  React.useEffect(() => {
    if (
      linkOperators.length > 0 &&
      filterModel.linkOperator &&
      !linkOperators.includes(filterModel.linkOperator)
    ) {
      applyFilterLinkOperator(linkOperators[0]);
    }
  }, [linkOperators, applyFilterLinkOperator, filterModel.linkOperator]);

  React.useEffect(() => {
    if (items.length > 0) {
      lastFilterRef.current!.focus();
    }
  }, [items.length]);

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {items.map((item, index) => (
          <GridFilterForm
            key={item.id == null ? index : item.id}
            item={item}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            hasMultipleFilters={hasMultipleFilters}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={filterModel.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
            focusElementRef={index === items.length - 1 ? lastFilterRef : null}
            linkOperators={linkOperators}
            hasLinkOperatorColumn={hasMultipleFilters && linkOperators.length > 0}
            columnsSort={columnsSort}
            deleteIconContainerSx={deleteIconContainerSx}
            linkOperatorContainerSx={linkOperatorContainerSx}
            columnContainerSx={columnContainerSx}
            operatorContainerSx={operatorContainerSx}
            valueContainerSx={valueContainerSx}
          />
        ))}
      </GridPanelContent>
      {!rootProps.disableMultipleColumnsFiltering && (
        <GridPanelFooter>
          <Button onClick={addNewFilter} startIcon={<GridAddIcon />} color="primary">
            {apiRef.current.getLocaleText('filterPanelAddFilter')}
          </Button>
        </GridPanelFooter>
      )}
    </GridPanelWrapper>
  );
}

GridFilterPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  deleteIconContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  linkOperatorContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  linkOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired).isRequired,
  operatorContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  valueContainerSx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridFilterPanel };
