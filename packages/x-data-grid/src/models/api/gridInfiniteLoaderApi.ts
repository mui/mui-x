export interface GridInfiniteLoaderPrivateApi {
  getInfiniteLoadingTriggerElement?: ({
    lastRowId,
  }: {
    lastRowId: string | number;
  }) => React.ReactNode;
  getInfiniteLoadingThreshold?: () => number | undefined;
}
