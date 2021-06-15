import * as React from 'react';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridMenu } from '../GridMenu';

export interface GridColumnHeaderMenuProps {
  columnMenuId: string;
  columnMenuButtonId: string;
  ContentComponent: React.JSXElementConstructor<any>;
  contentComponentProps?: any;
  field: string;
  open: boolean;
  target: Element | null;
}

export function GridColumnHeaderMenu({
  columnMenuId,
  columnMenuButtonId,
  ContentComponent,
  contentComponentProps,
  field,
  open,
  target,
}: GridColumnHeaderMenuProps) {
  const apiRef = useGridApiContext();
  const currentColumn = apiRef?.current.getColumn(field);

  const hideMenu = React.useCallback(
    (event) => {
      // Prevent triggering the sorting
      event.stopPropagation();
      apiRef?.current.hideColumnMenu();
    },
    [apiRef],
  );

  if (!target) {
    return null;
  }

  return (
    <GridMenu
      placement={`bottom-${currentColumn!.align === 'right' ? 'start' : 'end'}` as any}
      open={open}
      target={target}
      onClickAway={hideMenu}
    >
      <ContentComponent
        currentColumn={currentColumn}
        hideMenu={hideMenu}
        open={open}
        id={columnMenuId}
        labelledby={columnMenuButtonId}
        {...contentComponentProps}
      />
    </GridMenu>
  );
}
