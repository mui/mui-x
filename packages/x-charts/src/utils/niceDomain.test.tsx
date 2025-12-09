import { niceDomain } from './niceDomain';

describe('niceDomain', () => {
  it('should return a nice domain for linear scale', () => {
    const domain = [0.7, 9.3];
    const nice: number[] = niceDomain('linear', domain);
    expect(nice).toEqual([0, 10]);
  });

  it('should return a nice domain for log scale', () => {
    const domain = [3, 97];
    const nice: number[] = niceDomain('log', domain);
    expect(nice).toEqual([1, 100]);
  });

  it('should return a nice domain for time scale', () => {
    const domain = [new Date('2023-01-15'), new Date('2023-03-20')];
    const nice: Date[] = niceDomain('time', domain, 4);
    expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
  });

  it('should return a nice domain for time scale when timestamps are provided', () => {
    const domain = [new Date('2023-01-15').getTime(), new Date('2023-03-20').getTime()];
    const nice: Date[] = niceDomain('time', domain, 4);
    expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
  });

  it('should return a nice domain for utc scale', () => {
    const domain = [new Date('2023-01-15'), new Date('2023-03-20')];
    const nice: Date[] = niceDomain('utc', domain, 4);
    expect(nice).toEqual([new Date('2023-01-01'), new Date('2023-04-01')]);
  });

  it('should return a nice domain for linear scale depending on the tick count', () => {
    const domain = [29, 72];

    expect(niceDomain('linear', domain, 5)).toEqual([20, 80]);
    expect(niceDomain('linear', domain, 11)).toEqual([25, 75]);
  });
});
