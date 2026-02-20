'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { SankeyLayoutNode } from './sankey.types';
import { useSankeyNodeHighlightState } from './sankeyHighlightHooks';
import type { SeriesId } from '../models';

export interface SankeyNodeLabelProps {
  /**
   * The node data
   */
  node: SankeyLayoutNode;
  /**
   * The series id
   */
  seriesId: SeriesId;
}

/**
 * @ignore - internal component.
 */
export const SankeyNodeLabel = React.forwardRef<SVGTextElement, SankeyNodeLabelProps>(
  function SankeyNodeLabel(props, ref) {
    const { node, seriesId } = props;
    const theme = useTheme();

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    const isRightSide = node.depth === 0;

    // Determine label position
    const labelX = isRightSide
      ? x1 + 6 // Right side for first column
      : x0 - 6; // Left side for other columns

    const labelAnchor = isRightSide ? 'start' : 'end';

    const highlightState = useSankeyNodeHighlightState(
      React.useMemo(
        () => ({
          type: 'sankey',
          subType: 'node',
          seriesId,
          nodeId: node.id,
        }),
        [seriesId, node.id],
      ),
    );

    let opacity = 1;
    if (highlightState === 'faded') {
      opacity = 0.3;
    } else if (highlightState === 'highlighted') {
      opacity = 1;
    }

    if (!node.label) {
      return null;
    }

    return (
      <text
        ref={ref}
        x={labelX}
        y={(y0 + y1) / 2}
        textAnchor={labelAnchor}
        fill={(theme.vars || theme).palette.text.primary}
        fontSize={theme.typography.caption.fontSize}
        fontFamily={theme.typography.fontFamily}
        pointerEvents="none"
        opacity={opacity}
        data-node={node.id}
        data-highlighted={highlightState === 'highlighted' || undefined}
        data-faded={highlightState === 'faded' || undefined}
      >
        {node.label}
      </text>
    );
  },
);
