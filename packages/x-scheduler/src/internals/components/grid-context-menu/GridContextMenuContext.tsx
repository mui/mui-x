'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { GridContextMenuContext } from '@mui/x-scheduler-internals/internals';
import type {
  GridContextMenuAnchorPosition,
  GridContextMenuContextValue,
  OpenGridContextMenuParameters,
} from '@mui/x-scheduler-internals/internals';
import { GridContextMenu } from './GridContextMenu';
import type { GridContextMenuProviderProps } from './GridContextMenu.types';

interface GridContextMenuState {
  open: boolean;
  anchorPosition: GridContextMenuAnchorPosition | null;
  createEvent?: (event?: Event) => void;
}

const INITIAL_STATE: GridContextMenuState = {
  open: false,
  anchorPosition: null,
};

/**
 * Renders the grid context menu and provides the headless `GridContextMenuContext` that the grid
 * cells, columns and rows open it through.
 */
export function GridContextMenuProvider(props: GridContextMenuProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<GridContextMenuState>(INITIAL_STATE);

  const openMenu = useStableCallback((parameters: OpenGridContextMenuParameters) => {
    setState({
      open: true,
      anchorPosition: parameters.anchorPosition,
      createEvent: parameters.createEvent,
    });
  });

  // Keep the actions and position while closing so the menu's exit transition can play.
  const closeMenu = useStableCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
  });

  const contextValue = React.useMemo<GridContextMenuContextValue>(() => ({ openMenu }), [openMenu]);

  return (
    <GridContextMenuContext.Provider value={contextValue}>
      {children}
      {state.anchorPosition && (
        <GridContextMenu
          open={state.open}
          anchorPosition={state.anchorPosition}
          createEvent={state.createEvent}
          onClose={closeMenu}
        />
      )}
    </GridContextMenuContext.Provider>
  );
}
