import React, { useEffect, useRef, useState } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PricingModel, subscribeCurrencyPair } from '../data/streaming/pricing-service';
import {ColDef, Grid, GridApi, GridOptionsProp} from '@material-ui-x/grid';
import { currencyPairs } from '../data/currency-pairs';
import { pricingColumns } from '../data/streaming/pricing-service';

export interface PricingGridProps {
  min?: number;
  max?: number;
  options?: GridOptionsProp;
}
export const PricingGrid: React.FC<PricingGridProps> = (p) => {
  const [columns ] = useState<ColDef[]>(pricingColumns);
  const [rows] = useState<PricingModel[]>([]);

  const [started, setStarted] = useState<boolean>(false);
  const gridApiRef = useRef<GridApi>(null);
  const stopButton = useRef<HTMLButtonElement>(null);

  const subscription: Subscription = new Subscription();
  const handleNewPrice = (pricingModel: PricingModel) => {
    if (gridApiRef && gridApiRef.current) {
      gridApiRef.current.updateRowData([pricingModel]);
    }
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent<HTMLButtonElement>(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      for (let i = 0, len = currencyPairs.length; i < len; i++) {
        console.log('subscribing to ', currencyPairs[i]);
        const data$ = subscribeCurrencyPair(currencyPairs[i], i, p.min, p.max);
        subscription.add(data$.pipe(takeUntil(cancel$)).subscribe(data => handleNewPrice(data)));
      }
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
      <button ref={stopButton} onClick={onStartStreamBtnClick} style={{padding: 5, textTransform:"capitalize", margin: 10 }}>
        {started ? 'Stop' : 'Start'} Ticking
      </button>
      <div style={{ width: 800, height: 600 }}>
        <Grid rows={rows} columns={columns} apiRef={gridApiRef} {...p} />
      </div>
    </>
  );
};
