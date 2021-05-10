import * as React from 'react';
import { GridApiContext } from '../../GridApiContext';
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
  const apiRef = React.useContext(GridApiContext);
  const currentColumn = apiRef?.current.getColumnFromField(field);

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
