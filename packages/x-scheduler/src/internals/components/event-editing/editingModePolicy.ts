import { isCoarsePointer } from '@mui/x-scheduler-internals/internals';

export type EditingSurface = 'dialog' | 'drawer';

/**
 * Resolves the mode an occurrence opens in: creating/read-only opens the surface directly (`'edit'`),
 * the drawer always arms, and the dialog arms only on a coarse pointer.
 */
export function getInitialEditingMode(
  surface: EditingSurface,
  options: { isCreating?: boolean; isReadOnly?: boolean } = {},
): 'armed' | 'edit' {
  if (options.isCreating || options.isReadOnly) {
    return 'edit';
  }
  if (surface === 'drawer') {
    return 'armed';
  }
  // A coarse pointer can't hover to grab the resize handles, so it arms first.
  return isCoarsePointer() ? 'armed' : 'edit';
}
