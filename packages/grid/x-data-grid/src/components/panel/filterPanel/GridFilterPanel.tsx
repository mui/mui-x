import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
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
import { gridFilterableColumnDefinitionsSelector } from '../../../hooks/features/columns/gridColumnsSelector';

export interface GridFilterPanelProps
  extends Pick<GridFilterFormProps, 'linkOperators' | 'columnsSort'> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Props passed to each filter form.
   */
  filterFormProps?: Pick<
    GridFilterFormProps,
    | 'columnsSort'
    | 'deleteIconProps'
    | 'linkOperatorInputProps'
    | 'operatorInputProps'
    | 'columnInputProps'
    | 'valueInputProps'
  >;
}

const GridFilterPanel = React.forwardRef<HTMLDivElement, GridFilterPanelProps>(
  function GridFilterPanel(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const lastFilterRef = React.useRef<any>(null);

    const {
      linkOperators = [GridLinkOperator.And, GridLinkOperator.Or],
      columnsSort,
      filterFormProps,
      children,
      ...other
    } = props;

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
        const shouldCloseFilterPanel = items.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
          apiRef.current.hideFilterPanel();
        }
      },
      [apiRef, items.length],
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
      <GridPanelWrapper ref={ref} {...other}>
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
              columnsSort={columnsSort}
              {...filterFormProps}
            />
          ))}
        </GridPanelContent>
        {!rootProps.disableMultipleColumnsFiltering && (
          <GridPanelFooter>
            <rootProps.components.BaseButton
              onClick={addNewFilter}
              startIcon={<GridAddIcon />}
              color="primary"
              {...rootProps.componentsProps?.baseButton}
            >
              {apiRef.current.getLocaleText('filterPanelAddFilter')}
            </rootProps.components.BaseButton>
          </GridPanelFooter>
        )}
      </GridPanelWrapper>
    );
  },
);

GridFilterPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Props passed to each filter form.
   */
  filterFormProps: PropTypes.shape({
    columnInputProps: PropTypes.any,
    columnsSort: PropTypes.oneOf(['asc', 'desc']),
    deleteIconProps: PropTypes.any,
    linkOperatorInputProps: PropTypes.any,
    operatorInputProps: PropTypes.any,
    valueInputProps: PropTypes.any,
  }),
  /**
   * Sets the available logic operators.
   * @default [GridLinkOperator.And, GridLinkOperator.Or]
   */
  linkOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridFilterPanel };
