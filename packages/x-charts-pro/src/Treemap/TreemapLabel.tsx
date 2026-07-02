'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { SeriesId } from '@mui/x-charts/internals';
import type { TreemapLayoutNode } from './treemap.types';
import { useTreemapItemHighlightState } from './treemapHighlightHooks';
import { useUtilityClasses } from './treemapClasses';

export interface TreemapLabelProps {
  /**
   * The layout node to label.
   */
  node: TreemapLayoutNode;
  /**
   * The series id.
   */
  seriesId: SeriesId;
  /**
   * The horizontal padding between the tile edge and the label, in pixels.
   */
  paddingX: number;
  /**
   * The vertical padding between the tile edge and the label, in pixels.
   */
  paddingY: number;
}

/**
 * @ignore - internal component.
 */
export const TreemapLabel = React.forwardRef<SVGTextElement, TreemapLabelProps>(
  function TreemapLabel(props, ref) {
    const { node, seriesId, paddingX, paddingY } = props;
    const theme = useTheme();
    const classes = useUtilityClasses();

    const highlightState = useTreemapItemHighlightState(
      React.useMemo(
        () => ({ type: 'treemap' as const, seriesId, nodeId: node.id }),
        [seriesId, node.id],
      ),
    );

    if (!node.label) {
      return null;
    }

    let fill = (theme.vars || theme).palette.text.primary;
    if (node.color) {
      try {
        fill = theme.palette.getContrastText(node.color);
      } catch {
        // node.color is a format MUI can't decompose (e.g. a named CSS color); keep the default.
      }
    }

    return (
      <text
        ref={ref}
        className={classes.label}
        x={node.x0 + paddingX}
        y={node.y0 + paddingY}
        textAnchor="start"
        dominantBaseline="hanging"
        fill={fill}
        fontSize={theme.typography.caption.fontSize}
        fontFamily={theme.typography.fontFamily}
        pointerEvents="none"
        opacity={highlightState === 'faded' ? 0.3 : 1}
        data-node={node.id}
      >
        {node.label}
      </text>
    );
  },
);
