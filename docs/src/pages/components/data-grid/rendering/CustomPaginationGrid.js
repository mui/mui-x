import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

function CustomPagination(props) {
  const { state, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      page={state.pagination.page}
      count={state.pagination.pageCount}
      onChange={(event, value) => api.current.setPage(value)}
    />
  );
}

CustomPagination.propTypes = {
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The GridState object containing the grid current state.
   */
  state: PropTypes.shape({
    columnMenu: PropTypes.shape({
      field: PropTypes.string,
      open: PropTypes.bool.isRequired,
    }).isRequired,
    columnReorder: PropTypes.shape({
      dragCol: PropTypes.string.isRequired,
    }).isRequired,
    columns: PropTypes.shape({
      all: PropTypes.arrayOf(PropTypes.string).isRequired,
      lookup: PropTypes.object.isRequired,
    }).isRequired,
    containerSizes: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.shape({
        /**
         * The total Element size required to render the full set of rows minus the scrollbars.
         */
        dataContainerSizes: PropTypes.shape({
          /**
           * The height of a container or HTMLElement.
           */
          height: PropTypes.number.isRequired,
          /**
           * The width of a container or HTMLElement.
           */
          width: PropTypes.number.isRequired,
        }).isRequired,
        /**
         * The last page number.
         */
        lastPage: PropTypes.number.isRequired,
        /**
         * The size of the container containing all the rendered rows.
         */
        renderingZone: PropTypes.shape({
          /**
           * The height of a container or HTMLElement.
           */
          height: PropTypes.number.isRequired,
          /**
           * The width of a container or HTMLElement.
           */
          width: PropTypes.number.isRequired,
        }).isRequired,
        /**
         * Our rendering zone constitute the maximum number of rows that will be rendered at any given time in the grid.
         */
        renderingZonePageSize: PropTypes.number.isRequired,
        /**
         * The total element size required to render the set of rows including scrollbars.
         */
        totalSizes: PropTypes.shape({
          /**
           * The height of a container or HTMLElement.
           */
          height: PropTypes.number.isRequired,
          /**
           * The width of a container or HTMLElement.
           */
          width: PropTypes.number.isRequired,
        }).isRequired,
        /**
         * The number of rows that fit in the viewport.
         */
        viewportPageSize: PropTypes.number.isRequired,
        /**
         * The number of rows allocated for the rendered zone.
         */
        virtualRowsCount: PropTypes.number.isRequired,
        /**
         * The viewport size including scrollbars.
         */
        windowSizes: PropTypes.shape({
          /**
           * The height of a container or HTMLElement.
           */
          height: PropTypes.number.isRequired,
          /**
           * The width of a container or HTMLElement.
           */
          width: PropTypes.number.isRequired,
        }).isRequired,
      }),
    ]).isRequired,
    density: PropTypes.shape({
      headerHeight: PropTypes.number.isRequired,
      rowHeight: PropTypes.number.isRequired,
      value: PropTypes.oneOf(['comfortable', 'compact', 'standard']).isRequired,
    }).isRequired,
    filter: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          columnField: PropTypes.string,
          id: PropTypes.number,
          operatorValue: PropTypes.string,
          value: PropTypes.string,
        }),
      ).isRequired,
      linkOperator: PropTypes.oneOf(['and', 'or']),
    }).isRequired,
    isScrolling: PropTypes.bool.isRequired,
    keyboard: PropTypes.shape({
      cell: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.shape({
          colIndex: PropTypes.number.isRequired,
          rowIndex: PropTypes.number.isRequired,
        }),
      ]).isRequired,
      isMultipleKeyPressed: PropTypes.bool.isRequired,
    }).isRequired,
    options: PropTypes.object.isRequired,
    pagination: PropTypes.shape({
      page: PropTypes.number.isRequired,
      pageCount: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
      paginationMode: PropTypes.oneOf(['client', 'server']).isRequired,
      rowCount: PropTypes.number.isRequired,
    }).isRequired,
    preferencePanel: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      openedPanelValue: PropTypes.oneOf(['columns', 'filters']),
    }).isRequired,
    rendering: PropTypes.shape({
      realScroll: PropTypes.shape({
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
      }).isRequired,
      renderContext: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.shape({
          /**
           * The column index of the first rendered column.
           */
          firstColIdx: PropTypes.number,
          /**
           * The first rendered row in the rendering zone
           */
          firstRowIdx: PropTypes.number,
          /**
           * The column index of the last rendered column.
           */
          lastColIdx: PropTypes.number,
          /**
           * The last rendered row in the rendering zone
           */
          lastRowIdx: PropTypes.number,
          /**
           * The left empty width required to position the viewport at the beginning of the first rendered column.
           */
          leftEmptyWidth: PropTypes.number,
          /**
           * The rendering zone page calculated with the scroll position
           */
          page: PropTypes.number,
          /**
           * The current page size if pagination is enabled.
           */
          pageSize: PropTypes.number,
          /**
           * The current page if pagination is enabled.
           */
          paginationCurrentPage: PropTypes.number,
          /**
           * The right empty width limit the position the viewport to the end of the last rendered column.
           */
          rightEmptyWidth: PropTypes.number,
        }),
      ]).isRequired,
      renderedSizes: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.shape({
          /**
           * The total Element size required to render the full set of rows minus the scrollbars.
           */
          dataContainerSizes: PropTypes.object.isRequired,
          /**
           * The last page number.
           */
          lastPage: PropTypes.number.isRequired,
          /**
           * The size of the container containing all the rendered rows.
           */
          renderingZone: PropTypes.object.isRequired,
          /**
           * Our rendering zone constitute the maximum number of rows that will be rendered at any given time in the grid.
           */
          renderingZonePageSize: PropTypes.number.isRequired,
          /**
           * The total element size required to render the set of rows including scrollbars.
           */
          totalSizes: PropTypes.object.isRequired,
          /**
           * The number of rows that fit in the viewport.
           */
          viewportPageSize: PropTypes.number.isRequired,
          /**
           * The number of rows allocated for the rendered zone.
           */
          virtualRowsCount: PropTypes.number.isRequired,
          /**
           * The viewport size including scrollbars.
           */
          windowSizes: PropTypes.object.isRequired,
        }),
      ]).isRequired,
      renderingZoneScroll: PropTypes.shape({
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
      }).isRequired,
      virtualPage: PropTypes.number.isRequired,
      virtualRowsCount: PropTypes.number.isRequired,
    }).isRequired,
    rows: PropTypes.shape({
      allRows: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ).isRequired,
      idRowsLookup: PropTypes.object.isRequired,
      totalRowCount: PropTypes.number.isRequired,
    }).isRequired,
    scrollBar: PropTypes.shape({
      /**
       * Indicates if an horizontal scrollbar is visible.
       */
      hasScrollX: PropTypes.bool.isRequired,
      /**
       * Indicates if a vertical scrollbar is visible.
       */
      hasScrollY: PropTypes.bool.isRequired,
      /**
       * The scrollbar size.
       */
      scrollBarSize: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    selection: PropTypes.object.isRequired,
    sorting: PropTypes.shape({
      sortedRows: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ).isRequired,
      sortModel: PropTypes.arrayOf(
        PropTypes.shape({
          /**
           * The column field identifier.
           */
          field: PropTypes.string.isRequired,
          /**
           * The direction of the column that the grid should sort.
           */
          sort: PropTypes.oneOf(['asc', 'desc']),
        }),
      ).isRequired,
    }).isRequired,
    viewportSizes: PropTypes.shape({
      /**
       * The height of a container or HTMLElement.
       */
      height: PropTypes.number.isRequired,
      /**
       * The width of a container or HTMLElement.
       */
      width: PropTypes.number.isRequired,
    }).isRequired,
    visibleRows: PropTypes.shape({
      visibleRows: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ),
      visibleRowsLookup: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default function CustomPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pagination
        pageSize={5}
        components={{
          Pagination: CustomPagination,
        }}
        {...data}
      />
    </div>
  );
}
