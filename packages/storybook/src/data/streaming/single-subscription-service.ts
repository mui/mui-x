import { interval, Observable } from 'rxjs';
import { delay, flatMap } from 'rxjs/operators';
import { random, randomPrice } from '../random-generator';
import { RowId } from '@material-ui/x-grid';
import { currencyPairs } from '../currency-pairs';

export interface PricingModel {
  id: RowId;
  currencyPair: string;
  priceSpot?: number;
  price1m: number;
  price2m: number;
  price3m: number;
  price6m: number;
  price1y: number;
  price2y: number;
  price5y: number;
}

export const feedColumns = [
  { field: 'id' },
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
const generateModel = () => ({
  id: random(0, currencyPairs.length).toFixed(),
  currencyPair: currencyPairs[random(0, currencyPairs.length).toFixed()],
  priceSpot: randomPrice(),
  price1m: randomPrice(),
  price2m: randomPrice(),
  price3m: randomPrice(),
  price6m: randomPrice(),
  price1y: randomPrice(),
  price2y: randomPrice(),
  price5y: randomPrice(),
});
export function subscribeFeed(
  minUpdateRate = 100,
  maxUpdateRate = 500,
): Observable<PricingModel[]> {
  return interval(50).pipe(
    delay(random(0, maxUpdateRate - 50)),
    flatMap(() => {
      return new Observable<PricingModel[]>(obs => {
        const updates: PricingModel[] = [];
        for (let i = 0; i < random(1, 10); i++) {
          updates.push(generateModel());
        }
        obs.next(updates);
      });
    }),
  );
}
