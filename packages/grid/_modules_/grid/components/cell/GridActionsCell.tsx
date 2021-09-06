import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { gridClasses } from '../../gridClasses';
import { GridMenu, GridMenuProps } from '../menu/GridMenu';
import { GridActionsColDef } from '../../models/colDef/gridColDef';

const hasActions = (colDef: any): colDef is GridActionsColDef =>
  typeof colDef.getActions === 'function';

type GridActionsCellProps = GridRenderCellParams & Pick<GridMenuProps, 'position'>;

export const GridActionsCell = (props: GridActionsCellProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuId = useId();
  const buttonId = useId();
  const { colDef, id, api, position = 'bottom-end' } = props;

  if (!hasActions(colDef)) {
    throw new Error('Material-UI: Missing the `getActions` property in the `GridColDef`.');
  }

  const showMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const options = colDef.getActions(api.getRowParams(id));
  const iconButtons = options.filter((option) => !option.props.showInMenu);
  const menuButtons = options.filter((option) => option.props.showInMenu);

  return (
    <div className={gridClasses.actionsCell}>
      {iconButtons.map((button, index) => React.cloneElement(button, { key: index }))}
      {menuButtons.length > 0 && (
        <IconButton
          id={buttonId}
          aria-label={api.getLocaleText('actionsCellMore')}
          aria-controls={menuId}
          aria-expanded={anchorEl ? 'true' : undefined}
          aria-haspopup="true"
          size="small"
          onClick={showMenu}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
      {menuButtons.length > 0 && (
        <GridMenu
          id={menuId}
          onClickAway={hideMenu}
          onClick={hideMenu}
          open={Boolean(anchorEl)}
          target={anchorEl}
          position={position}
          aria-labelledby={buttonId}
        >
          <MenuList className="MuiDataGrid-gridMenuList">
            {menuButtons.map((button, index) => React.cloneElement(button, { key: index }))}
          </MenuList>
        </GridMenu>
      )}
    </div>
  );
};

export const renderActionsCell = (params) => <GridActionsCell {...params} />;
