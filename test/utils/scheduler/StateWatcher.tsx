import * as React from 'react';

export function StateWatcher({
  Context,
  selector,
  onValueChange,
}: {
  Context: React.Context<any>;
  selector: (state: any) => any;
  onValueChange: (value: any) => void;
}) {
  const store = React.useContext(Context);
  if (!store) {
    throw new Error('StateWatcher must be used inside the matching Provider');
  }

  const getSelected = React.useCallback(() => selector(store.getSnapshot()), [store, selector]);

  const value = React.useSyncExternalStore(store.subscribe, getSelected, getSelected);

  React.useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  return null;
}
