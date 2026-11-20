import * as React from 'react';
import { useStore } from '@base-ui/utils/store';

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

  const value = useStore(store, selector);

  React.useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  return null;
}
