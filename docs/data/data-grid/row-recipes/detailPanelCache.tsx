import * as React from 'react';
import { DataGridProProps, GridRowId } from '@mui/x-data-grid-pro';

export interface DetailPanelCacheOptions {
  onExpandedRowIdsChange?: NonNullable<
    DataGridProProps['onDetailPanelExpandedRowIdsChange']
  >;
}

export function useDetailPanelCache<TData>(options: DetailPanelCacheOptions = {}) {
  const detailPanelDataCache = React.useRef(new Map<GridRowId, TData>()).current;
  const [detailPanelHeights, setDetailPanelHeights] = React.useState<
    Map<GridRowId, number>
  >(new Map());

  const handleDetailPanelHeightChange = React.useCallback(
    (rowId: GridRowId, height: number, isLoaded: boolean) => {
      setDetailPanelHeights((prev) => {
        const currentHeight = prev.get(rowId);
        if (!isLoaded && currentHeight !== undefined && height <= currentHeight) {
          return prev;
        }
        const next = new Map(prev);
        next.set(rowId, height);
        return next;
      });
    },
    [],
  );

  const handleDetailPanelExpansionChange = React.useCallback<
    NonNullable<DataGridProProps['onDetailPanelExpandedRowIdsChange']>
  >(
    (newExpandedRowIds, details) => {
      options.onExpandedRowIdsChange?.(newExpandedRowIds, details);

      for (const [id] of detailPanelDataCache) {
        if (!newExpandedRowIds.has(id)) {
          detailPanelDataCache.delete(id);
        }
      }

      setDetailPanelHeights((prev) => {
        const next = new Map(prev);
        let changed = false;
        for (const rowId of prev.keys()) {
          if (!newExpandedRowIds.has(rowId)) {
            next.delete(rowId);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    },
    [detailPanelDataCache, options],
  );

  return {
    detailPanelDataCache,
    detailPanelHeights,
    handleDetailPanelHeightChange,
    handleDetailPanelExpansionChange,
  };
}

// Wrapper component that tracks detail panel height via ResizeObserver
export interface DetailPanelWrapperProps {
  rowId: GridRowId;
  onHeightChange: (rowId: GridRowId, height: number, isLoaded: boolean) => void;
  children: React.ReactNode;
}

export function DetailPanelWrapper({
  rowId,
  onHeightChange,
  children,
}: DetailPanelWrapperProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isLoadedRef = React.useRef(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return () => {};
    }

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height > 0) {
        onHeightChange(rowId, height, isLoadedRef.current);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [rowId, onHeightChange]);

  const handleLoaded = React.useCallback(() => {
    isLoadedRef.current = true;
  }, []);

  const childrenWithLoaded = React.isValidElement(children)
    ? React.cloneElement(children, { onLoaded: handleLoaded } as any)
    : children;

  return <div ref={ref}>{childrenWithLoaded}</div>;
}
