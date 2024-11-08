export type TreeViewCancellableEvent = {
  // TODO: Rename `defaultXTreeViewPrevented`
  defaultMuiPrevented?: boolean;
};

export type TreeViewCancellableEventHandler<Event> = (
  event: Event & TreeViewCancellableEvent,
) => void;
