export const DEFAULT_COLUMNS = [{ field: 'DEFAULT_COLUMN' }];

export const DEFAULT_PARAMS = {
  resizeThrottleMs: 100,
  columns: DEFAULT_COLUMNS,

  dimensions: {
    autoHeight: false,
    columnsTotalWidth: 0,
    leftPinnedWidth: 0,
    rightPinnedWidth: 0,
    topPinnedHeight: 0,
    bottomPinnedHeight: 0,
  },

  virtualization: {
    isRtl: false,
    rowBufferPx: 150,
    columnBufferPx: 150,
  },
};
