import * as React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material/styles';
import { unstable_useId as useId } from '@mui/utils';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { gridClasses } from '../../constants/gridClasses';
import { GridMenu, GridMenuProps } from '../menu/GridMenu';
import { GridActionsColDef } from '../../models/colDef/gridColDef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

const hasActions = (colDef: any): colDef is GridActionsColDef =>
  typeof colDef.getActions === 'function';

interface TouchRippleActions {
  stop: (event: any, callback?: () => void) => void;
}

interface GridActionsCellProps extends Omit<GridRenderCellParams, 'api'> {
  api?: GridRenderCellParams['api'];
  position?: GridMenuProps['position'];
}

function GridActionsCell(props: GridActionsCellProps) {
  const {
    api,
    colDef,
    id,
    hasFocus,
    isEditable,
    field,
    value,
    formattedValue,
    row,
    rowNode,
    cellMode,
    tabIndex,
    position = 'bottom-end',
    focusElementRef,
    ...other
  } = props;
  const [focusedButtonIndex, setFocusedButtonIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const ignoreCallToFocus = React.useRef(false);
  const touchRippleRefs = React.useRef<Record<string, TouchRippleActions | null>>({});
  const theme = useTheme();
  const menuId = useId();
  const buttonId = useId();
  const rootProps = useGridRootProps();

  if (!hasActions(colDef)) {
    throw new Error('MUI X: Missing the `getActions` property in the `GridColDef`.');
  }

  const options = colDef.getActions(apiRef.current.getRowParams(id));
  const iconButtons = options.filter((option) => !option.props.showInMenu);
  const menuButtons = options.filter((option) => option.props.showInMenu);
  const numberOfButtons = iconButtons.length + (menuButtons.length ? 1 : 0);

  React.useLayoutEffect(() => {
    if (!hasFocus) {
      Object.entries(touchRippleRefs.current).forEach(([index, ref]) => {
        ref?.stop({}, () => {
          delete touchRippleRefs.current[index];
        });
      });
    }
  }, [hasFocus]);

  React.useEffect(() => {
    if (focusedButtonIndex < 0 || !rootRef.current) {
      return;
    }

    if (focusedButtonIndex >= rootRef.current.children.length) {
      return;
    }

    const child = rootRef.current.children[focusedButtonIndex] as HTMLElement;
    child.focus({ preventScroll: true });
  }, [focusedButtonIndex]);

  React.useEffect(() => {
    if (!hasFocus) {
      setFocusedButtonIndex(-1);
      ignoreCallToFocus.current = false;
    }
  }, [hasFocus]);

  React.useImperativeHandle(
    focusElementRef,
    () => ({
      focus() {
        // If ignoreCallToFocus is true, then one of the buttons was clicked and the focus is already set
        if (!ignoreCallToFocus.current) {
          // find the first focusable button and pass the index to the state
          const focusableButtonIndex = options.findIndex((o) => !o.props.disabled);
          setFocusedButtonIndex(focusableButtonIndex);
        }
      },
    }),
    [options],
  );

  React.useEffect(() => {
    if (focusedButtonIndex >= numberOfButtons) {
      setFocusedButtonIndex(numberOfButtons - 1);
    }
  }, [focusedButtonIndex, numberOfButtons]);

  const showMenu = () => {
    setOpen(true);
    setFocusedButtonIndex(numberOfButtons - 1);
    ignoreCallToFocus.current = true;
  };

  const hideMenu = () => {
    setOpen(false);
  };

  const handleTouchRippleRef =
    (index: string | number) => (instance: TouchRippleActions | null) => {
      touchRippleRefs.current[index] = instance;
    };

  const handleButtonClick =
    (index: number, onClick?: React.MouseEventHandler): React.MouseEventHandler =>
    (event) => {
      setFocusedButtonIndex(index);
      ignoreCallToFocus.current = true;

      if (onClick) {
        onClick(event);
      }
    };

  const handleRootKeyDown = (event: React.KeyboardEvent) => {
    if (numberOfButtons <= 1) {
      return;
    }

    const getNewIndex = (index: number, direction: 'left' | 'right'): number => {
      if (index < 0 || index > options.length) {
        return index;
      }

      // for rtl mode we need to reverse the direction
      const rtlMod = theme.direction === 'rtl' ? -1 : 1;
      const indexMod = (direction === 'left' ? -1 : 1) * rtlMod;

      // if the button that should receive focus is disabled go one more step
      return options[index + indexMod]?.props.disabled
        ? getNewIndex(index + indexMod, direction)
        : index + indexMod;
    };

    let newIndex: number = focusedButtonIndex;
    if (event.key === 'ArrowRight') {
      newIndex = getNewIndex(focusedButtonIndex, 'right');
    } else if (event.key === 'ArrowLeft') {
      newIndex = getNewIndex(focusedButtonIndex, 'left');
    }

    if (newIndex < 0 || newIndex >= numberOfButtons) {
      return; // We're already in the first or last item = do nothing and let the grid listen the event
    }

    if (newIndex !== focusedButtonIndex) {
      event.preventDefault(); // Prevent scrolling
      event.stopPropagation(); // Don't stop propagation for other keys, for example ArrowUp
      setFocusedButtonIndex(newIndex);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (['Tab', 'Escape'].includes(event.key)) {
      hideMenu();
    }
  };

  return (
    <div
      role="menu"
      ref={rootRef}
      tabIndex={-1}
      className={gridClasses.actionsCell}
      onKeyDown={handleRootKeyDown}
      {...other}
    >
      {iconButtons.map((button, index) =>
        React.cloneElement(button, {
          key: index,
          touchRippleRef: handleTouchRippleRef(index),
          onClick: handleButtonClick(index, button.props.onClick),
          tabIndex: focusedButtonIndex === index ? tabIndex : -1,
        }),
      )}

      {menuButtons.length > 0 && buttonId && (
        <rootProps.slots.baseIconButton
          ref={buttonRef}
          id={buttonId}
          aria-label={apiRef.current.getLocaleText('actionsCellMore')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          role="menuitem"
          size="small"
          onClick={showMenu}
          touchRippleRef={handleTouchRippleRef(buttonId)}
          tabIndex={focusedButtonIndex === iconButtons.length ? tabIndex : -1}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.moreActionsIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      )}

      {menuButtons.length > 0 && (
        <GridMenu open={open} target={buttonRef.current} position={position} onClose={hideMenu}>
          <MenuList
            id={menuId}
            className={gridClasses.menuList}
            onKeyDown={handleListKeyDown}
            aria-labelledby={buttonId}
            variant="menu"
            autoFocusItem
          >
            {menuButtons.map((button, index) =>
              React.cloneElement(button, { key: index, closeMenu: hideMenu }),
            )}
          </MenuList>
        </GridMenu>
      )}
    </div>
  );
}

GridActionsCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  api: PropTypes.object,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focus: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
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
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridActionsCell };

export const renderActionsCell = (params: GridRenderCellParams) => <GridActionsCell {...params} />;
