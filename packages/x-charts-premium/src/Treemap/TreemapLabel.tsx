'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { TreemapLayoutNode } from './treemap.types';
import { useUtilityClasses } from './treemapClasses';
import { TREEMAP_LABEL_PADDING } from './utils';

export interface TreemapLabelProps {
  /**
   * The layout node to label.
   */
  node: TreemapLayoutNode;
}

/**
 * @ignore - internal component.
 */
function TreemapLabel(props: TreemapLabelProps) {
  const { node } = props;
  const theme = useTheme();
  const classes = useUtilityClasses();

  const fill = React.useMemo(() => {
    const fallback = (theme.vars || theme).palette.text.primary;
    if (!node.color) {
      return fallback;
    }
    try {
      return theme.palette.getContrastText(node.color);
    } catch {
      // node.color is a format MUI can't decompose (e.g. a named CSS color); keep the default.
      return fallback;
    }
  }, [node.color, theme]);

  if (!node.label) {
    return null;
  }

  return (
    <text
      className={classes.label}
      x={node.x0 + TREEMAP_LABEL_PADDING}
      y={node.y0 + TREEMAP_LABEL_PADDING}
      textAnchor="start"
      dominantBaseline="hanging"
      fill={fill}
      fontSize={theme.typography.caption.fontSize}
      fontFamily={theme.typography.fontFamily}
      pointerEvents="none"
      data-node={node.id}
    >
      {node.label}
    </text>
  );
}

const MemoTreemapLabel = React.memo(TreemapLabel);

export { MemoTreemapLabel as TreemapLabel };
