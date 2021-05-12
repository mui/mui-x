import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
  GridColumnMenu,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
  XGrid,
} from '@material-ui/x-grid';
import StarOutlineIcon from '@material-ui/icons/StarOutline';

const useStyles = makeStyles((theme) => ({
  primary: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  secondary: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

function CustomColumnMenu(props) {
  const classes = useStyles();
  const { hideMenu, currentColumn, color, ...other } = props;

  if (currentColumn.field === 'name') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        className={classes[color]}
        {...other}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      </GridColumnMenuContainer>
    );
  }
  if (currentColumn.field === 'stars') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        className={classes[color]}
        {...other}
      >
        <div
          style={{
            width: 127,
            height: 160,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <StarOutlineIcon style={{ fontSize: 80 }} />
        </div>
      </GridColumnMenuContainer>
    );
  }
  return (
    <GridColumnMenu
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      className={classes[color]}
      {...other}
    />
  );
}

CustomColumnMenu.propTypes = {
  color: PropTypes.string.isRequired,
  currentColumn: PropTypes.shape({
    /**
     * Allows to align the column values in cells.
     */
    align: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Class name that will be added in cells for that column.
     */
    cellClassName: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.func,
      PropTypes.string,
    ]),
    /**
     * Set of CSS class rules that will be dynamically applied on cells.
     */
    cellClassRules: PropTypes.object,
    /**
     * The description of the column rendered as tooltip if the column header name is not fully displayed.
     */
    description: PropTypes.string,
    /**
     * Allows to disable the click event in cells.
     */
    disableClickEventBubbling: PropTypes.bool,
    /**
     * If `true`, the column menu is disabled for this column.
     */
    disableColumnMenu: PropTypes.bool,
    /**
     * If `true`, the cells of the column are editable.
     * @default true
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
        InputComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
          .isRequired,
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
    headerClassName: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
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
     */
    hideSortIcons: PropTypes.bool,
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
     * @param params
     */
    valueFormatter: PropTypes.func,
    /**
     * Function that allows to get a specific data instead of field to render in the cell.
     * @param params
     */
    valueGetter: PropTypes.func,
    /**
     * Set the width of the column.
     * @default 100
     */
    width: PropTypes.number,
  }).isRequired,
  hideMenu: PropTypes.func.isRequired,
};

export { CustomColumnMenu };

export default function CustomSortIcons() {
  const [color, setColor] = React.useState('primary');
  return (
    <div style={{ height: 300, width: '100%' }}>
      <Button
        color={color}
        onClick={() =>
          setColor((current) => (current === 'primary' ? 'secondary' : 'primary'))
        }
      >
        Toggle Colors
      </Button>
      <div style={{ height: 250, width: '100%' }}>
        <XGrid
          columns={[
            { field: 'default', width: 150 },
            { field: 'name', width: 150 },
            { field: 'stars', width: 150 },
          ]}
          rows={[
            {
              id: 1,
              name: 'Material-UI',
              stars: 28000,
              default: 'Open source',
            },
            {
              id: 2,
              name: 'XGrid',
              stars: 15000,
              default: 'Enterprise',
            },
          ]}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
          componentsProps={{
            columnMenu: { color },
          }}
        />
      </div>
    </div>
  );
}
