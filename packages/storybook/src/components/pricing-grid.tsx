import * as React from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DataGridPro, DataGridProProps, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  PricingModel,
  subscribeCurrencyPair,
  pricingColumns,
} from '../data/streaming/pricing-service';
import { currencyPairs } from '../data/currency-pairs';

export interface PricingGridProps extends Omit<DataGridProProps, 'columns' | 'rows' | 'getRowId'> {
  min?: number;
  max?: number;
}
export const PricingGrid = (props: PricingGridProps) => {
  const { min, max } = props;
  const [columns] = React.useState<GridColDef[]>(pricingColumns);
  const [rows] = React.useState<PricingModel[]>([]);

  const [started, setStarted] = React.useState<boolean>(false);
  const apiRef = useGridApiRef();
  const stopButton = React.useRef<HTMLButtonElement>(null);

  const { current: subscription } = React.useRef(new Subscription());
  const handleNewPrice = (pricingModel: PricingModel) => {
    apiRef.current.updateRows([pricingModel]);
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent<HTMLButtonElement>(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      for (let i = 0, len = currencyPairs.length; i < len; i += 1) {
        const data$ = subscribeCurrencyPair(currencyPairs[i], i, min, max);
        subscription.add(data$.pipe(takeUntil(cancel$)).subscribe((data) => handleNewPrice(data)));
      }
      setStarted(true);
    }
  };

  React.useEffect(() => {
    return () => {
      subscription.unsubscribe();
    };
  }, [stopButton, subscription]);

  const onStartStreamBtnClick = () => {
    if (!started) {
      subscribeToStream();
    }
  };
  const getRowId = React.useCallback((row) => row.idfield, []);
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
        <DataGridPro rows={rows} columns={columns} apiRef={apiRef} {...props} getRowId={getRowId} />
      </div>
    </React.Fragment>
  );
};
