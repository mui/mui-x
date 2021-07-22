import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/styles';
import { DataGrid, isOverflown } from '@material-ui/data-grid';

const useStyles = makeStyles(() => ({
  root: {
    alignItems: 'center',
    lineHeight: '24px',
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    '& .cellValue': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}));

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <div
      ref={wrapper}
      className={classes.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cellDiv}
        style={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <div ref={cellValue} className="cellValue">
        {value}
      </div>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </div>
  );
});

GridCellExpand.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={params.colDef.width}
    />
  );
}

renderCellExpand.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.shape({
    /**
     * Allows to align the column values in cells.
     */
    align: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Class name that will be added in cells for that column.
     */
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * The description of the column rendered as tooltip if the column header name is not fully displayed.
     */
    description: PropTypes.string,
    /**
     * If `true`, the column menu is disabled for this column.
     * @default false
     */
    disableColumnMenu: PropTypes.bool,
    /**
     * If `true`, this column will not be included in exports.
     * @default false
     */
    disableExport: PropTypes.bool,
    /**
     * If `true`, this column cannot be reordered.
     * @default false
     */
    disableReorder: PropTypes.bool,
    /**
     * If `true`, the cells of the column are editable.
     * @default false
     */
    editable: PropTypes.bool,
    /**
     * The column identifier. It's used to map with [[GridRowData]] values.
     */
    field: PropTypes.string.isRequired,
    /**
     * If `true`, the column is filterable.
     * @default true
     */
    filterable: PropTypes.bool,
    /**
     * Allows setting the filter operators for this column.
     */
    filterOperators: PropTypes.arrayOf(
      PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        InputComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        InputComponentProps: PropTypes.object,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    /**
     * If set, it indicates that a column has fluid width. Range [0, ∞).
     */
    flex: PropTypes.number,
    /**
     * Header cell element alignment.
     */
    headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Class name that will be added in the column header cell.
     */
    headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * The title of the column rendered in the column header cell.
     */
    headerName: PropTypes.string,
    /**
     * If `true`, hide the column.
     * @default false
     */
    hide: PropTypes.bool,
    /**
     * Toggle the visibility of the sort icons.
     * @default false
     */
    hideSortIcons: PropTypes.bool,
    /**
     * Sets the minimum width of a column.
     * @default 50
     */
    minWidth: PropTypes.number,
    /**
     * Allows to override the component rendered as cell for this column.
     * @param params
     */
    renderCell: PropTypes.func,
    /**
     * Allows to override the component rendered in edit cell mode for this column.
     * @param params
     */
    renderEditCell: PropTypes.func,
    /**
     * Allows to render a component in the column header cell.
     * @param params
     */
    renderHeader: PropTypes.func,
    /**
     * If `true`, the column is resizable.
     * @default true
     */
    resizable: PropTypes.bool,
    /**
     * If `true`, the column is sortable.
     * @default true
     */
    sortable: PropTypes.bool,
    /**
     * A comparator function used to sort rows.
     */
    sortComparator: PropTypes.func,
    /**
     * Type allows to merge this object with a default definition [[GridColDef]].
     * @default 'string'
     */
    type: PropTypes.string,
    /**
     * Function that allows to apply a formatter before rendering its value.
     * @param {GridValueFormatterParams} params Object containing parameters for the formatter.
     * @returns {GridCellValue} The formatted value.
     */
    valueFormatter: PropTypes.func,
    /**
     * Function that allows to get a specific data instead of field to render in the cell.
     * @param params
     */
    valueGetter: PropTypes.func,
    /**
     * To be used in combination with `type: 'singleSelect'`. This is an array of the possible cell values and labels.
     */
    valueOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
        PropTypes.string,
      ]),
    ),
    /**
     * Function that takes the user-entered value and converts it to a value used internally.
     * @param {GridCellValue} value The user-entered value.
     * @param {GridCellParams} params The params when called before saving the value.
     * @returns {GridCellValue} The converted value to use internally.
     */
    valueParser: PropTypes.func,
    /**
     * Set the width of the column.
     * @default 100
     */
    width: PropTypes.number,
  }).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

const columns = [
  { field: 'col1', headerName: 'Column 1', width: 80, renderCell: renderCellExpand },
  {
    field: 'col2',
    headerName: 'Column 2',
    width: 100,
    renderCell: renderCellExpand,
  },
  {
    field: 'col3',
    headerName: 'Column 3',
    width: 150,
    renderCell: renderCellExpand,
  },
];

const rows = [
  {
    id: 1,
    col1: 'Hello',
    col2: 'World',
    col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used.',
  },
  {
    id: 2,
    col1: 'XGrid',
    col2: 'is Awesome',
    col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 3,
    col1: 'Material-UI',
    col2: 'is Amazing',
    col3: 'Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 4,
    col1: 'Hello',
    col2: 'World',
    col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form.',
  },
  {
    id: 5,
    col1: 'XGrid',
    col2: 'is Awesome',
    col3: 'Typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 6,
    col1: 'Material-UI',
    col2: 'is Amazing',
    col3: 'Lorem ipsum may be used as a placeholder before final copy is available.',
  },
];

export default function RenderExpandCellGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
