import { interval, Observable } from 'rxjs';
import { delay, flatMap } from 'rxjs/operators';
import { random } from '../random-generator';
import { PricingModel, randomPricingModel } from './pricing-service';

export function subscribeFeed(_, maxUpdateRate = 500): Observable<PricingModel[]> {
  return interval(50).pipe(
    delay(random(0, maxUpdateRate - 50)),
    flatMap(() => {
      return new Observable<PricingModel[]>((obs) => {
        const updates: PricingModel[] = [];
        for (let i = 0; i < random(1, 10); i += 1) {
          updates.push(randomPricingModel());
        }
        obs.next(updates);
      });
    }),
  );
}
