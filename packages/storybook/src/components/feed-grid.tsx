import * as React from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ColDef, GridOptionsProp, XGrid, useApiRef } from '@material-ui/x-grid';
import { PricingModel } from '../data/streaming/pricing-service';
import { feedColumns, subscribeFeed } from '../data/streaming/single-subscription-service';

export interface FeedGridProps {
  min?: number;
  max?: number;
  options?: GridOptionsProp;
}
export const FeedGrid: React.FC<FeedGridProps> = (p) => {
  const [columns] = React.useState<ColDef[]>(feedColumns);
  const [rows] = React.useState<PricingModel[]>([]);

  const [started, setStarted] = React.useState<boolean>(false);
  const apiRef = useApiRef();
  const stopButton = React.useRef<HTMLButtonElement>(null);
  const { current: subscriptionRef } = React.useRef(new Subscription());

  const handleNewPrices = (updates: PricingModel[]) => {
    apiRef.current.updateRows(updates);
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent<HTMLButtonElement>(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      const data$ = subscribeFeed(p.min, p.max);
      subscriptionRef.add(
        data$.pipe(takeUntil(cancel$)).subscribe((data) => handleNewPrices(data)),
      );
      setStarted(true);
    }
  };

  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line no-console
      console.log('Unmounting, cleaning subscriptions ');
      subscriptionRef.unsubscribe();
    };
  }, [stopButton, subscriptionRef]);

  const onStartStreamBtnClick = () => {
    if (!started) {
      subscribeToStream();
    }
  };
  return (
    <React.Fragment>
      <div>
        <button
          type="button"
          ref={stopButton}
          onClick={onStartStreamBtnClick}
          style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
        >
          {started ? 'Stop' : 'Start'} Ticking
        </button>
      </div>
      <div style={{ width: 800, height: 600 }}>
        <XGrid rows={rows} columns={columns} apiRef={apiRef} {...p} />
      </div>
    </React.Fragment>
  );
};
