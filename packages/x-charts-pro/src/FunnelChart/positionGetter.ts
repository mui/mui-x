export type PositionGetter = (
  value: number,
  bandIndex: number,
  bandIdentifier: string | number,
  stackOffset?: number,
  useBand?: boolean,
) => number;
