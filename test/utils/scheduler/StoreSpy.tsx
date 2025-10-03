import * as React from 'react';
import { spy as sinonSpy, SinonSpy } from 'sinon';

export function StoreSpy<T>({
  Context,
  method,
  onSpyReady,
}: {
  Context: React.Context<T | null>;
  method: Extract<keyof T, string>;
  onSpyReady: (sp: SinonSpy) => void;
}) {
  const store = React.useContext(Context);
  if (!store) {
    throw new Error('StoreSpy must be used inside the matching Provider');
  }

  const spyRef = React.useRef<SinonSpy | null>(null);

  React.useEffect(() => {
    const fn = (store as any)[method];
    if (typeof fn !== 'function') {
      throw new Error(`Method "${String(method)}" not found or is not a function on store`);
    }
    const sp = sinonSpy(store as any, method as any);
    spyRef.current = sp;
    onSpyReady(sp);

    return () => spyRef.current?.restore?.();
  }, [store, method, onSpyReady]);

  return null;
}
