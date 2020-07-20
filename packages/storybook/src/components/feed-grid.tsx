import * as React from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ColDef, GridApi, GridOptionsProp, XGrid } from '@material-ui/x-grid';
import { PricingModel } from '../data/streaming/pricing-service';
import { feedColumns, subscribeFeed } from '../data/streaming/single-subscription-service';

export interface FeedGridProps {
  min?: number;
  max?: number;
  options?: GridOptionsProp;
}
export const FeedGrid: React.FC<FeedGridProps> = p => {
  const [columns] = React.useState<ColDef[]>(feedColumns);
  const [rows] = React.useState<PricingModel[]>([]);

  const [started, setStarted] = React.useState<boolean>(false);
  const gridApiRef = React.useRef<GridApi>(null);
  const stopButton = React.useRef<HTMLButtonElement>(null);

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

      const data$ = subscribeFeed(p.min, p.max);
      subscription.add(data$.pipe(takeUntil(cancel$)).subscribe(data => handleNewPrices(data)));
      setStarted(true);
    }
  };

  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line no-console
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
        <XGrid rows={rows} columns={columns} apiRef={gridApiRef} {...p} />
      </div>
    </React.Fragment>
  );
};
