export const max = (numbers: number[]) => Math.max(...numbers, -Infinity);
export const min = (numbers: number[]) => Math.min(...numbers, Infinity);
// From point1 to point2, get the x value from y
export const xFromY =
  (x1: number, y1: number, x2: number, y2: number) =>
  (y: number): number => {
    if (y1 === y2) {
      return x1;
    }

    const result = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;

    return Number.isNaN(result) ? 0 : result;
  };

// From point1 to point2, get the y value from x
export const yFromX =
  (x1: number, y1: number, x2: number, y2: number) =>
  (x: number): number => {
    if (x1 === x2) {
      return y1;
    }
    const result = ((y2 - y1) * (x - x1)) / (x2 - x1) + y1;
    return Number.isNaN(result) ? 0 : result;
  };
