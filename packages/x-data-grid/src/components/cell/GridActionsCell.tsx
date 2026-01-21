'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useRtl } from '@mui/system/RtlProvider';
import useId from '@mui/utils/useId';
import { warnOnce } from '@mui/x-internals/warning';
import { GridRowParams } from '../../models/params/gridRowParams';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { gridClasses } from '../../constants/gridClasses';
import { GridMenu, GridMenuProps } from '../menu/GridMenu';
import { GridActionsColDef } from '../../models/colDef/gridColDef';
import { GridValidRowModel, GridTreeNodeWithRender } from '../../models/gridRows';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridActionsCellItem, type GridActionsCellItemProps } from './GridActionsCellItem';

const hasActions = (colDef: any): colDef is GridActionsColDef =>
  typeof colDef.getActions === 'function';

interface TouchRippleActions {
  stop: (event: any, callback?: () => void) => void;
}

interface GridActionsCellProps<
  R extends GridValidRowModel = any,
  V = any,
  F = V,
  N extends GridTreeNodeWithRender = GridTreeNodeWithRender,
> extends Omit<GridRenderCellParams<R, V, F, N>, 'api'> {
  api?: GridRenderCellParams['api'];
  position?: GridMenuProps['position'];
  children: React.ReactNode;
  /**
   * If true, the children passed to the component will not be validated.
   * If false, only `GridActionsCellItem` and `React.Fragment` are allowed as children.
   * Only use this prop if you know what you are doing.
   * @default false
   */
  suppressChildrenValidation?: boolean;
  /**
   * Callback to fire before the menu gets opened.
   * Use this callback to prevent the menu from opening.
   *
   * @param {GridRowParams<R>} params Row parameters.
   * @param {React.MouseEvent<HTMLElement>} event The event triggering this callback.
   * @returns {boolean} if the menu should be opened.
   */
  onMenuOpen?: (params: GridRowParams<R>, event: React.MouseEvent<HTMLElement>) => boolean;
  /**
   * Callback to fire before the menu gets closed.
   * Use this callback to prevent the menu from closing.
   *
   * @param {GridRowParams<R>} params Row parameters.
   * @param {React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent | TouchEvent | undefined} event The event triggering this callback.
   * @returns {boolean} if the menu should be closed.
   */
  onMenuClose?: (
    params: GridRowParams<R>,
    event:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent
      | MouseEvent
      | TouchEvent
      | undefined,
  ) => boolean;
}

function GridActionsCell<
  R extends GridValidRowModel = any,
  V = any,
  F = V,
  N extends GridTreeNodeWithRender = GridTreeNodeWithRender,
>(props: GridActionsCellProps<R, V, F, N>) {
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
    onMenuOpen,
    onMenuClose,
    children,
    suppressChildrenValidation,
    ...other
  } = props;
  const [focusedButtonIndex, setFocusedButtonIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const ignoreCallToFocus = React.useRef(false);
  const touchRippleRefs = React.useRef<Record<string, TouchRippleActions | null>>({});
  const isRtl = useRtl();
  const menuId = useId();
  const buttonId = useId();
  const rootProps = useGridRootProps();
  const rowParams = apiRef.current.getRowParams(id);

  const actions: React.ReactElement<GridActionsCellItemProps>[] = [];
  React.Children.forEach(children, (child) => {
    // Unwrap React.Fragment
    if (React.isValidElement<GridActionsCellItemProps>(child)) {
      if (child.type === React.Fragment) {
        React.Children.forEach(child.props.children, (fragChild) => {
          if (React.isValidElement<GridActionsCellItemProps>(fragChild)) {
            actions.push(fragChild);
          }
        });
      } else if (child.type === GridActionsCellItem || suppressChildrenValidation) {
        actions.push(child);
      } else {
        const childType = typeof child.type === 'function' ? child.type.name : child.type;
        warnOnce(
          `MUI X: Invalid child type in \`GridActionsCell\`. Expected \`GridActionsCellItem\` or \`React.Fragment\`, got \`${childType}\`.
If this is intentional, you can suppress this warning by passing the \`suppressChildrenValidation\` prop to \`GridActionsCell\`.`,
          'error',
        );
      }
    }
  });

  const iconButtons = actions.filter((option) => !option.props.showInMenu);
  const menuButtons = actions.filter((option) => option.props.showInMenu);
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

  const firstFocusableButtonIndex = actions.findIndex((o) => !o.props.disabled);
  React.useEffect(() => {
    if (hasFocus && focusedButtonIndex === -1) {
      setFocusedButtonIndex(firstFocusableButtonIndex);
    }
    if (!hasFocus) {
      setFocusedButtonIndex(-1);
      ignoreCallToFocus.current = false;
    }
  }, [hasFocus, focusedButtonIndex, firstFocusableButtonIndex]);

  React.useEffect(() => {
    if (focusedButtonIndex >= numberOfButtons) {
      setFocusedButtonIndex(numberOfButtons - 1);
    }
  }, [focusedButtonIndex, numberOfButtons]);

  const showMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (onMenuOpen && !onMenuOpen(rowParams, event)) {
      return;
    }
    setOpen(true);
    setFocusedButtonIndex(numberOfButtons - 1);
    ignoreCallToFocus.current = true;
  };

  const hideMenu = (
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent | TouchEvent,
  ) => {
    if (onMenuClose && !onMenuClose(rowParams, event)) {
      return;
    }
    setOpen(false);
  };

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (open) {
      hideMenu(event);
    } else {
      showMenu(event);
    }
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
      if (index < 0 || index > actions.length) {
        return index;
      }

      // for rtl mode we need to reverse the direction
      const rtlMod = isRtl ? -1 : 1;
      const indexMod = (direction === 'left' ? -1 : 1) * rtlMod;

      // if the button that should receive focus is disabled go one more step
      return actions[index + indexMod]?.props.disabled
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

  // role="menu" requires at least one child element
  const attributes =
    numberOfButtons > 0
      ? {
          role: 'menu',
          onKeyDown: handleRootKeyDown,
        }
      : undefined;

  return (
    <div ref={rootRef} tabIndex={-1} className={gridClasses.actionsCell} {...attributes} {...other}>
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
          onClick={toggleMenu}
          touchRippleRef={handleTouchRippleRef(buttonId)}
          tabIndex={focusedButtonIndex === iconButtons.length ? tabIndex : -1}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.moreActionsIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      )}

      {menuButtons.length > 0 && (
        <GridMenu open={open} target={buttonRef.current} position={position} onClose={hideMenu}>
          <rootProps.slots.baseMenuList
            id={menuId}
            className={gridClasses.menuList}
            aria-labelledby={buttonId}
            autoFocusItem
          >
            {menuButtons.map((button, index) =>
              React.cloneElement(button, { key: index, closeMenu: hideMenu }),
            )}
          </rootProps.slots.baseMenuList>
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
  children: PropTypes.node.isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
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

// Temporary wrapper for backward compatibility.
// Only used to support `getActions` method in `GridColDef`.
// TODO(v9): Remove this wrapper and the default `renderCell` in gridActionsColDef
function GridActionsCellWrapper(props: GridRenderCellParams) {
  const { colDef, id } = props;
  const apiRef = useGridApiContext();

  if (!hasActions(colDef)) {
    throw new Error('MUI X: Missing the `getActions` property in the `GridColDef`.');
  }

  const actions = colDef.getActions(apiRef.current.getRowParams(id));

  return (
    <GridActionsCell suppressChildrenValidation {...props}>
      {actions}
    </GridActionsCell>
  );
}

export const renderActionsCell = (params: GridRenderCellParams) => (
  <GridActionsCellWrapper {...params} />
);
