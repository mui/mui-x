import { MuiEvent } from '@mui/x-internals/types';
import { TreeViewItemId } from '../../models';

export interface TreeViewEventLookup {
  /**
   * Fired before an item is expanded or collapsed.
   */
  beforeItemToggleExpansion: {
    params: {
      isExpansionPrevented: boolean;
      shouldBeExpanded: boolean;
      itemId: TreeViewItemId;
    };
    event: React.SyntheticEvent | null;
  };
}

export type TreeViewEvents = keyof TreeViewEventLookup;

export type TreeViewEventListener<E extends TreeViewEvents> = (
  params: TreeViewEventLookup[E] extends { params: any }
    ? TreeViewEventLookup[E]['params']
    : undefined,
  event: TreeViewEventLookup[E] extends { event: any }
    ? MuiEvent<TreeViewEventLookup[E]['event']>
    : MuiEvent<{}>,
) => void;
