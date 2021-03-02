import * as React from 'react';
import Button from '@material-ui/core/Button';
import { fromEvent, Subscription, interval, Observable } from 'rxjs';
import { takeUntil, tap, delay, flatMap } from 'rxjs/operators';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';

const currencyPairs = [
  'USDGBP',
  'USDEUR',
  'GBPEUR',
  'JPYUSD',
  'MXNUSD',
  'BTCUSD',
  'USDCAD',
  'EURJPY',
  'EURUSD',
  'EURCHF',
  'USDCHF',
  'EURGBP',
  'GBPUSD',
  'AUDCAD',
  'NZDUSD',
  'GBPCHF',
  'AUDUSD',
  'GBPJPY',
  'USDJPY',
  'CHFJPY',
  'EURCAD',
  'AUDJPY',
  'EURAUD',
  'AUDNZD',
  'CADEUR',
  'CHFMXN',
  'ETHUSD',
  'BCHUSD',
  'ETHBTC',
  'XRPUSD',
  'XRPBTC',
  'USDLTC',
  'USDXRP',
  'USDDSH',
  'USDBCH',
  'JPYEUR',
  'JPYUSD',
  'JPYGBP',
  'JPYCAD',
  'JPYCHF',
  'JPYAUD',
  'JPYNZD',
  'JPYSGD',
  'JPYNOK',
  'JPYRUB',
  'JPYSEK',
  'JPYTRY',
  'JPYZAR',
  'JPYHKD',
  'JPYCNH',
  'JPYDKK',
  'JPYMXN',
  'JPYPLN',
  'JPYXAG',
  'JPYXAU',
  'JPYBTC',
  'JPYETH',
  'JPYLTC',
  'JPYXRP',
  'JPYDSH',
  'JPYBCH',
  'GBPEUR',
  'GBPRUB',
  'GBPTRY',
];

const random = (min, max) => Math.random() * (max - min) + min;
const randomPrice = (min = 0, max = 100000) => random(min, max);

function randomPricingModel() {
  return {
    idfield: random(0, currencyPairs.length).toFixed(),
    currencyPair: currencyPairs[random(0, currencyPairs.length).toFixed()],
    priceSpot: randomPrice(),
    price1m: randomPrice(),
    price2m: randomPrice(),
    price3m: randomPrice(),
    price6m: randomPrice(),
    price1y: randomPrice(),
    price2y: randomPrice(),
    price5y: randomPrice(),
  };
}

function subscribeFeed(_, maxUpdateRate = 500) {
  return interval(50).pipe(
    delay(random(0, maxUpdateRate - 50)),
    flatMap(() => {
      return new Observable((obs) => {
        const updates = [];
        for (let i = 0; i < random(1, 10); i += 1) {
          updates.push(randomPricingModel());
        }
        obs.next(updates);
      });
    }),
  );
}

const pricingColumns = [
  { field: 'idfield' },
  { field: 'currencyPair' },
  { field: 'priceSpot', type: 'number' },
  { field: 'price1m', type: 'number' },
  { field: 'price2m', type: 'number' },
  { field: 'price3m', type: 'number' },
  { field: 'price6m', type: 'number' },
  { field: 'price1y', type: 'number' },
  { field: 'price2y', type: 'number' },
  { field: 'price5y', type: 'number' },
];

export default function StreamingDemo() {
  const rate = { min: 100, max: 500 };
  const [columns] = React.useState(pricingColumns);
  const [rows] = React.useState([]);
  const [started, setStarted] = React.useState(false);
  const apiRef = useGridApiRef();
  const stopButton = React.useRef(null);
  const { current: subscriptionRef } = React.useRef(new Subscription());

  const handleNewPrices = (updates) => {
    apiRef.current.updateRows(updates);
  };

  const subscribeToStream = () => {
    if (!started && stopButton && stopButton.current != null) {
      const cancel$ = fromEvent(stopButton.current, 'click').pipe(
        tap(() => {
          setImmediate(() => setStarted(false));
        }),
      );

      const data$ = subscribeFeed(rate.min, rate.max);
      subscriptionRef.add(
        data$.pipe(takeUntil(cancel$)).subscribe((data) => handleNewPrices(data)),
      );
      setStarted(true);
    }
  };

  React.useEffect(() => {
    return () => {
      subscriptionRef.unsubscribe();
    };
  }, [stopButton, subscriptionRef]);

  const onStartStreamBtnClick = () => {
    if (!started) {
      subscribeToStream();
    }
  };

  const getRowId = React.useCallback((row) => row.idfield, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 400,
        width: '100%',
      }}
    >
      <div style={{ marginBottom: 15 }}>
        <Button
          variant="outlined"
          color="primary"
          ref={stopButton}
          onClick={onStartStreamBtnClick}
        >
          {started ? 'Stop' : 'Start'} Ticking
        </Button>
      </div>

      <XGrid rows={rows} columns={columns} apiRef={apiRef} getRowId={getRowId} />
    </div>
  );
}
