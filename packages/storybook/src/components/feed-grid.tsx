import React, { useEffect, useRef, useState } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PricingModel } from '../data/streaming/pricing-service';
import { feedColumns, subscribeFeed } from '../data/streaming/single-subscription-service';
import { ColDef, GridApi, GridOptionsProp, Grid } from '@material-ui/x-grid';

export interface FeedGridProps {
  min?: number;
  max?: number;
  options?: GridOptionsProp;
}
export const FeedGrid: React.FC<FeedGridProps> = p => {
  const [columns] = useState<ColDef[]>(feedColumns);
  const [rows] = useState<PricingModel[]>([]);

  const [started, setStarted] = useState<boolean>(false);
  const gridApiRef = useRef<GridApi>(null);
  const stopButton = useRef<HTMLButtonElement>(null);

  const subscription: Subscription = new Subscription();

  const handleNewPrices = (updates: PricingModel[]) => {
    if (gridApiRef && gridApiRef.current) {
      gridApiRef.current.updateRowData(updates);
    }
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent<HTMLButtonElement>(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      console.log('subscribing to feed');
      const data$ = subscribeFeed(p.min, p.max);
      subscription.add(data$.pipe(takeUntil(cancel$)).subscribe(data => handleNewPrices(data)));
      setStarted(true);
    }
  };

  useEffect(() => {
    // subscribeToStream();
    return () => {
      console.log('Unmounting, cleaning subscriptions ');
      subscription.unsubscribe();
    };
  }, [stopButton]);

  const onStartStreamBtnClick = () => {
    if (!started) {
      subscribeToStream();
    }
  };
  return (
    <>
      <button
        ref={stopButton}
        onClick={onStartStreamBtnClick}
        style={{ padding: 5, textTransform: 'capitalize', margin: 10 }}
      >
        {started ? 'Stop' : 'Start'} Ticking
      </button>
      <div style={{ width: 800, height: 600 }}>
        <Grid rows={rows} columns={columns} apiRef={gridApiRef} {...p} />
      </div>
    </>
  );
};
