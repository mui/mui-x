import * as React from 'react';
import { vi, MockInstance } from 'vitest';

export function StoreSpy<T>({
  Context,
  method,
  onSpyReady,
}: {
  Context: React.Context<T | null>;
  method: Extract<keyof T, string>;
  onSpyReady: (sp: MockInstance) => void;
}) {
  const store = React.useContext(Context);
  if (!store) {
    throw new Error('StoreSpy must be used inside the matching Provider');
  }

  const spyRef = React.useRef<MockInstance | null>(null);

  React.useEffect(() => {
    const fn = (store as any)[method];
    if (typeof fn !== 'function') {
      throw new Error(`Method "${String(method)}" not found or is not a function on store`);
    }
    const sp = vi.spyOn(store as any, method as any);
    spyRef.current = sp;
    onSpyReady(sp);

    return () => spyRef.current?.mockRestore?.();
  }, [store, method, onSpyReady]);

  return null;
}
