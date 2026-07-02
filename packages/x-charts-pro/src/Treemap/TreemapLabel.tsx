'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { SeriesId } from '@mui/x-charts/internals';
import type { TreemapLayoutNode } from './treemap.types';
import { useTreemapItemHighlightState } from './treemapHighlightHooks';
import { useUtilityClasses } from './treemapClasses';

const LABEL_PADDING = 4;

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
   * Minimum tile width in pixels for the label to be displayed.
   */
  minLabelWidth: number;
  /**
   * Minimum tile height in pixels for the label to be displayed.
   */
  minLabelHeight: number;
}

/**
 * @ignore - internal component.
 */
export const TreemapLabel = React.forwardRef<SVGTextElement, TreemapLabelProps>(
  function TreemapLabel(props, ref) {
    const { node, seriesId, minLabelWidth, minLabelHeight } = props;
    const theme = useTheme();
    const classes = useUtilityClasses();

    const highlightState = useTreemapItemHighlightState(
      React.useMemo(
        () => ({ type: 'treemap' as const, seriesId, nodeId: node.id }),
        [seriesId, node.id],
      ),
    );

    const width = node.x1 - node.x0;
    const height = node.y1 - node.y0;

    if (!node.label || width < minLabelWidth || height < minLabelHeight) {
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
        x={node.x0 + LABEL_PADDING}
        y={node.y0 + LABEL_PADDING}
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
