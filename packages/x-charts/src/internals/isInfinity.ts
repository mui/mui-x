export function isInfinity(v: any): v is number {
  return typeof v === 'number' && !Number.isFinite(v);
}
