import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEventCallback as useEventCallback, HTMLElementType } from '@mui/utils';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridMenu, GridMenuProps } from '../GridMenu';

export interface GridColumnHeaderMenuProps {
  columnMenuId?: string;
  columnMenuButtonId?: string;
  ContentComponent: React.JSXElementConstructor<any>;
  contentComponentProps?: any;
  field: string;
  open: boolean;
  target: HTMLElement | null;
  onExited?: GridMenuProps['onExited'];
}

function GridColumnHeaderMenu({
  columnMenuId,
  columnMenuButtonId,
  ContentComponent,
  contentComponentProps,
  field,
  open,
  target,
  onExited,
}: GridColumnHeaderMenuProps) {
  const apiRef = useGridApiContext();
  const colDef = apiRef.current.getColumn(field);

  const hideMenu = useEventCallback((event?: Event) => {
    if (event) {
      // Prevent triggering the sorting
      event.stopPropagation();

      if (target?.contains(event.target as HTMLElement)) {
        return;
      }
    }
    apiRef.current.hideColumnMenu();
  });

  if (!target || !colDef) {
    return null;
  }

  return (
    <GridMenu
      placement={`bottom-${colDef!.align === 'right' ? 'start' : 'end'}` as any}
      open={open}
      target={target}
      onClose={hideMenu}
      onExited={onExited}
    >
      <ContentComponent
        colDef={colDef}
        hideMenu={hideMenu}
        open={open}
        id={columnMenuId}
        labelledby={columnMenuButtonId}
        {...contentComponentProps}
      />
    </GridMenu>
  );
}

GridColumnHeaderMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  columnMenuButtonId: PropTypes.string,
  columnMenuId: PropTypes.string,
  ContentComponent: PropTypes.elementType.isRequired,
  contentComponentProps: PropTypes.any,
  field: PropTypes.string.isRequired,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
  target: HTMLElementType,
} as any;

export { GridColumnHeaderMenu };
