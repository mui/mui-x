import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import { unstable_useId as useId } from '@mui/material/utils';
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

interface GridActionsCellProps extends Omit<GridRenderCellParams, 'value' | 'formattedValue'> {
  value?: GridRenderCellParams['value'];
  formattedValue?: GridRenderCellParams['formattedValue'];
  position?: GridMenuProps['position'];
}

const GridActionsCell = (props: GridActionsCellProps) => {
  const {
    colDef,
    id,
    api,
    hasFocus,
    isEditable,
    field,
    value,
    formattedValue,
    row,
    rowNode,
    cellMode,
    getValue,
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
  const menuId = useId();
  const buttonId = useId();
  const rootProps = useGridRootProps();

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
    if (focusedButtonIndex >= 0) {
      const child = rootRef.current?.children[focusedButtonIndex] as HTMLElement;
      child.focus();
    }
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
          setFocusedButtonIndex(0);
        }
      },
    }),
    [],
  );

  if (!hasActions(colDef)) {
    throw new Error('MUI: Missing the `getActions` property in the `GridColDef`.');
  }

  const options = colDef.getActions(apiRef.current.getRowParams(id));
  const iconButtons = options.filter((option) => !option.props.showInMenu);
  const menuButtons = options.filter((option) => option.props.showInMenu);
  const numberOfButtons = iconButtons.length + (menuButtons.length ? 1 : 0);

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

    let newIndex: number = focusedButtonIndex;
    if (event.key === 'ArrowRight') {
      newIndex += 1;
    } else if (event.key === 'ArrowLeft') {
      newIndex -= 1;
    }

    if (newIndex < 0 || newIndex >= numberOfButtons) {
      return; // We're already in the first or last item = do nothing and let the grid listen the event
    }

    if (newIndex !== focusedButtonIndex) {
      event.preventDefault(); // Prevent scrolling
      event.stopPropagation(); // Don't stop propagation for other keys, e.g. ArrowUp
      setFocusedButtonIndex(newIndex);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (['Tab', 'Enter', 'Escape'].includes(event.key)) {
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
        <IconButton
          ref={buttonRef}
          id={buttonId}
          aria-label={apiRef.current.getLocaleText('actionsCellMore')}
          aria-controls={menuId}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          role="menuitem"
          size="small"
          onClick={showMenu}
          touchRippleRef={handleTouchRippleRef(buttonId)}
          tabIndex={focusedButtonIndex === iconButtons.length ? tabIndex : -1}
        >
          <rootProps.components.MoreActionsIcon fontSize="small" />
        </IconButton>
      )}

      {menuButtons.length > 0 && (
        <GridMenu
          onClickAway={hideMenu}
          onClick={hideMenu}
          open={open}
          target={buttonRef.current}
          position={position}
        >
          <MenuList
            id={menuId}
            className={gridClasses.menuList}
            onKeyDown={handleListKeyDown}
            aria-labelledby={buttonId}
            variant="menu"
            autoFocusItem
          >
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
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: PropTypes.any.isRequired,
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
  formattedValue: PropTypes.any,
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: PropTypes.func.isRequired,
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
  row: PropTypes.object.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  value: PropTypes.any,
} as any;

export { GridActionsCell };

export const renderActionsCell = (params: GridRenderCellParams) => <GridActionsCell {...params} />;
