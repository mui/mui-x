import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { gridClasses } from '../../gridClasses';
import { GridMenu, GridMenuProps } from '../menu/GridMenu';
import { GridActionsColDef } from '../../models/colDef/gridColDef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

const hasActions = (colDef: any): colDef is GridActionsColDef =>
  typeof colDef.getActions === 'function';

type GridActionsCellProps = Pick<GridRenderCellParams, 'colDef' | 'id' | 'api'> &
  Pick<GridMenuProps, 'position'>;

const GridActionsCell = (props: GridActionsCellProps) => {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const buttonId = useId();
  const rootProps = useGridRootProps();
  const { colDef, id, api, position = 'bottom-end' } = props; // TODO apply the rest to the root element

  if (!hasActions(colDef)) {
    throw new Error('MUI: Missing the `getActions` property in the `GridColDef`.');
  }

  const showMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(true);
  };

  const hideMenu = () => setOpen(false);

  const options = colDef.getActions(api.getRowParams(id));
  const iconButtons = options.filter((option) => !option.props.showInMenu);
  const menuButtons = options.filter((option) => option.props.showInMenu);

  return (
    <div className={gridClasses.actionsCell}>
      {iconButtons.map((button, index) => React.cloneElement(button, { key: index }))}
      {menuButtons.length > 0 && (
        <IconButton
          ref={buttonRef}
          id={buttonId}
          aria-label={api.getLocaleText('actionsCellMore')}
          aria-controls={menuId}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          size="small"
          onClick={showMenu}
        >
          <rootProps.components.MoreActionsIcon fontSize="small" />
        </IconButton>
      )}

      {menuButtons.length > 0 && (
        <GridMenu
          id={menuId}
          onClickAway={hideMenu}
          onClick={hideMenu}
          open={open}
          target={buttonRef.current}
          position={position}
          aria-labelledby={buttonId}
        >
          <MenuList className={gridClasses.menuList}>
            {menuButtons.map((button, index) => React.cloneElement(button, { key: index }))}
          </MenuList>
        </GridMenu>
      )}
    </div>
  );
};

GridActionsCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  position: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
} as any;

export { GridActionsCell };

export const renderActionsCell = (params: GridRenderCellParams) => <GridActionsCell {...params} />;
