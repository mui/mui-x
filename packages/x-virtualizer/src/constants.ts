export const DEFAULT_COLUMNS = [{ field: 'DEFAULT_COLUMN', computedWidth: 0 }];

export const DEFAULT_PARAMS = {
  resizeThrottleMs: 100,
  columns: DEFAULT_COLUMNS,

  dimensions: {
    autoHeight: false,
    topPinnedHeight: 0,
    bottomPinnedHeight: 0,
  },

  virtualization: {
    isRtl: false,
    rowBufferPx: 150,
    columnBufferPx: 150,
  },
};
