import * as React from 'react';

export function SchedulerStoreRunner<T>({
  context,
  onMount,
}: {
  context: React.Context<T | null>;
  onMount: (store: T) => void;
}) {
  const store = React.useContext(context);
  if (!store) {
    throw new Error('SchedulerStoreRunner must be used inside the matching Provider');
  }

  React.useEffect(() => {
    onMount(store);
  }, [store, onMount]);

  return null;
}
