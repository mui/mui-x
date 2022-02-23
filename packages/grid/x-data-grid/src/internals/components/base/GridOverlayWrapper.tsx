import * as React from 'react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { GridEvents } from '../../models/events';

export function GridOverlayWrapper(props: React.PropsWithChildren<{}>) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

  const [viewportInnerSize, setViewportInnerSize] = React.useState(
    () => apiRef.current.getRootDimensions()?.viewportInnerSize ?? null,
  );

  const handleViewportSizeChange = React.useCallback(() => {
    setViewportInnerSize(apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  }, [apiRef]);

  useEnhancedEffect(() => {
    return apiRef.current.subscribeEvent(
      GridEvents.viewportInnerSizeChange,
      handleViewportSizeChange,
    );
  }, [apiRef, handleViewportSizeChange]);

  let height: React.CSSProperties['height'] = viewportInnerSize?.height ?? 0;
  if (rootProps.autoHeight && height === 0) {
    height = 'auto';
  }

  if (!viewportInnerSize) {
    return null;
  }

  return (
    <div
      style={{
        height,
        width: viewportInnerSize?.width ?? 0,
        position: 'absolute',
        top: headerHeight,
        bottom: height === 'auto' ? 0 : undefined,
      }}
      {...props}
    />
  );
}
