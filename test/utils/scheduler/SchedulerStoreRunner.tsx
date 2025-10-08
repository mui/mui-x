import * as React from 'react';

export function SchedulerStoreRunner({
  context,
  onMount,
}: {
  context: React.Context<any>;
  onMount: (store: any) => void;
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
