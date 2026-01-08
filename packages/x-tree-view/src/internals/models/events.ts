import { MuiEvent } from '@mui/x-internals/types';
import { TreeViewItemId } from '../../models';

interface TreeViewEventLookup {
  /**
   * Fired before an item is expanded or collapsed.
   */
  beforeItemToggleExpansion: {
    parameters: {
      isExpansionPrevented: boolean;
      shouldBeExpanded: boolean;
      itemId: TreeViewItemId;
    };
    event: React.SyntheticEvent | null;
  };
}

export type TreeViewEvents = keyof TreeViewEventLookup;

export type TreeViewEventListener<E extends TreeViewEvents> = (
  params: TreeViewEventParameters<E>,
  event: TreeViewEventLookup[E] extends { event: any }
    ? MuiEvent<TreeViewEventLookup[E]['event']>
    : MuiEvent<{}>,
) => void;

export type TreeViewEventParameters<E extends TreeViewEvents> = TreeViewEventLookup[E] extends {
  parameters: infer P;
}
  ? P
  : undefined;

export type TreeViewEventEvent<E extends TreeViewEvents> = TreeViewEventLookup[E] extends {
  event: infer EV;
}
  ? EV
  : undefined;
