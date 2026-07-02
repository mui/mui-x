import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks';
import { useTreemapLayout } from '../hooks/useTreemapSeries';

/**
 * @ignore - internal component.
 */
export function FocusedTreemapRect(props: React.SVGAttributes<SVGRectElement>) {
  const focusedItem = useFocusedItem();
  const layout = useTreemapLayout();
  const theme = useTheme();

  if (!focusedItem || focusedItem.type !== 'treemap' || !layout) {
    return null;
  }

  const node = layout.byId.get(focusedItem.nodeId);
  if (!node) {
    return null;
  }

  return (
    <rect
      x={node.x0}
      y={node.y0}
      width={Math.max(0, node.x1 - node.x0)}
      height={Math.max(0, node.y1 - node.y0)}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      pointerEvents="none"
      {...props}
    />
  );
}
