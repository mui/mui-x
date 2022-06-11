import * as React from 'react';
import { unstable_useId as useId, useForkRef } from '@mui/material/utils';
import MenuList from '@mui/material/MenuList';
import { ButtonProps } from '@mui/material/Button';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';

export const GridToolbarExportContainer = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarExportContainer(props, ref) {
    const { children, onClick, ...other } = props;

    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const menuId = useId();

    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      onClick?.(event);
    };

    const handleMenuClose = () => setOpen(false);

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        handleMenuClose();
      }
    };

    if (children == null) {
      return null;
    }

    return (
      <React.Fragment>
        <rootProps.components.BaseButton
          ref={handleRef}
          size="small"
          startIcon={<rootProps.components.ExportIcon />}
          aria-expanded={open ? 'true' : undefined}
          aria-label={apiRef.current.getLocaleText('toolbarExportLabel')}
          aria-haspopup="menu"
          aria-labelledby={menuId}
          id={buttonId}
          {...other}
          onClick={handleMenuOpen}
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('toolbarExport')}
        </rootProps.components.BaseButton>
        <GridMenu
          open={open}
          target={buttonRef.current}
          onClickAway={handleMenuClose}
          position="bottom-start"
        >
          <MenuList
            id={menuId}
            className={gridClasses.menuList}
            aria-labelledby={buttonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={open}
          >
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) {
                return child;
              }
              return React.cloneElement(child, { hideMenu: handleMenuClose });
            })}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);
