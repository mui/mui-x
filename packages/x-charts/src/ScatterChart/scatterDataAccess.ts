import type { ColumnarScatterData, ScatterData, ScatterValueType } from '../models';

/**
 * Returns `true` when the scatter `data` payload is in columnar form (backed
 * by typed arrays) rather than the default array-of-objects shape. Use this
 * in hot loops to branch into the fast columnar path that avoids per-point
 * object dereferencing.
 */
export function isColumnarScatterData(data: unknown): data is ColumnarScatterData {
  return data != null && (data as ColumnarScatterData).__columnar === true;
}

export function getScatterLength(data: ScatterData | undefined): number {
  if (data === undefined) {
    return 0;
  }
  if (isColumnarScatterData(data)) {
    return data.length;
  }
  return data.length;
}

export function getScatterX(data: ScatterData, i: number): number {
  if (isColumnarScatterData(data)) {
    return data.x[i];
  }
  return data[i].x;
}

export function getScatterY(data: ScatterData, i: number): number {
  if (isColumnarScatterData(data)) {
    return data.y[i];
  }
  return data[i].y;
}

export function getScatterZ(data: ScatterData, i: number): number | undefined {
  if (isColumnarScatterData(data)) {
    return data.z?.[i];
  }
  return data[i]?.z;
}

export function getScatterId(data: ScatterData, i: number): string | number | undefined {
  if (isColumnarScatterData(data)) {
    const ids = data.ids;
    return ids === undefined ? undefined : ids[i];
  }
  return data[i]?.id;
}

/**
 * Returns the point at `i` as a plain `ScatterValueType` object. For columnar
 * data, allocates a fresh object on each call — prefer the per-field
 * accessors (`getScatterX`/`getScatterY`/...) in tight loops.
 */
export function getScatterPoint(data: ScatterData, i: number): ScatterValueType {
  if (isColumnarScatterData(data)) {
    const id = data.ids?.[i];
    return {
      x: data.x[i],
      y: data.y[i],
      z: data.z?.[i],
      id,
    };
  }
  return data[i];
}
