/**
 * @internal
 * The default props to use for Material UI components.
 */
export const DATA_GRID_DEFAULT_SLOT_PROPS = {
  baseBadge: () => ({
    color: 'default',
  }),
  baseMenuList: (ownerState?: { module: 'toolbar'; open: boolean }) => {
    if (ownerState?.module === 'toolbar') {
      return {
        autoFocusItem: ownerState.open,
      };
    }
    return {
      variant: 'menu',
      autoFocusItem: true,
    };
  },
};
