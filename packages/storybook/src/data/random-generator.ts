export const random = (min: number, max: number): number => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number): number => Number(random(min, max).toFixed());
export const randomPrice = (min = 0, max = 100000): number => random(min, max);
export const randomRate = (): number => random(0, 1);
export const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
export const getDate = () => randomDate(new Date(2012, 0, 1), new Date());
export const randomArrayItem = (arr: any[]) => arr[random(0, arr.length - 1).toFixed()];
