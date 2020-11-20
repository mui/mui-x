import * as React from 'react';
import { ColumnMenuState } from '../../../hooks/features/columnMenu/columnMenuState';
import { GridState } from '../../../hooks/features/core/gridState';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { findHeaderElementFromField } from '../../../utils/domUtils';
import { ApiContext } from '../../api-context';
import { GridMenu } from '../GridMenu';
import { FilterMenuItem } from './FilterMenuItem';
import { HideColMenuItem } from './HideColMenuItem';
import { SortMenuItems } from './SortMenuItems';

const columnMenuStateSelector = (state: GridState) => state.columnMenu;

export const GridColumnHeaderMenu: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const columnMenuState = useGridSelector(apiRef!, columnMenuStateSelector);
  const currentColumn = columnMenuState.field
    ? apiRef?.current.getColumnFromField(columnMenuState.field)
    : null;
  const [target, setTarget] = React.useState<Element | null>(null);

  // TODO: Fix issue with portal in V5
  const hideTimeout = React.useRef<any>();
  const hideMenu = React.useCallback(() => {
    apiRef?.current.hideColumnMenu();
  }, [apiRef]);

  const hideMenuDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(hideMenu, 50);
  }, [hideMenu]);

  const updateColumnMenu = React.useCallback(
    ({ open, field }: ColumnMenuState) => {
      if (field && open) {
        setImmediate(() => clearTimeout(hideTimeout.current));

        const headerCellEl = findHeaderElementFromField(
          apiRef!.current!.rootElementRef!.current!,
          field!,
        );
        const menuIconElement = headerCellEl!.querySelector('.MuiDataGrid-menuIconButton');
        setTarget(menuIconElement);
      }
    },
    [apiRef],
  );

  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        hideMenu();
      }
    },
    [hideMenu],
  );

  React.useEffect(() => {
    updateColumnMenu(columnMenuState);
  }, [columnMenuState, updateColumnMenu]);

  if (!target) {
    return null;
  }
  return (
    <GridMenu
      open={columnMenuState.open}
      target={target}
      onKeyDown={handleListKeyDown}
      onClickAway={hideMenuDelayed}
    >
      <SortMenuItems onClick={hideMenu} column={currentColumn!} />
      <FilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideColMenuItem onClick={hideMenu} column={currentColumn!} />
    </GridMenu>
  );
};
