import * as React from 'react';
import { spy as sinonSpy, SinonSpy } from 'sinon';
import { EventCalendarStoreContext } from '@mui/x-scheduler/primitives/use-event-calendar-store-context/useEventCalendarStoreContext';

export function StoreSpy({
  method,
  onSpyReady,
}: {
  method: 'updateRecurringEvent' | 'updateEvent' | 'createEvent';
  onSpyReady: (sp: SinonSpy) => void;
}) {
  const store = React.useContext(EventCalendarStoreContext);
  if (!store) {
    throw new Error('StoreSpy must be used inside StandaloneView');
  }

  const spyRef = React.useRef<SinonSpy | null>(null);

  React.useEffect(() => {
    const sp = sinonSpy(store as any, method);
    spyRef.current = sp;
    onSpyReady(sp);

    return () => spyRef.current?.restore?.();
  }, [store, method, onSpyReady]);

  return null;
}
