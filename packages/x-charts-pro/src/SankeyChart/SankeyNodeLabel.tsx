'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { SankeyLayoutNode } from './sankey.types';

export interface SankeyNodeLabelProps {
  /**
   * The node data
   */
  node: SankeyLayoutNode;
}

/**
 * @ignore - internal component.
 */
export const SankeyNodeLabel = React.forwardRef<SVGTextElement, SankeyNodeLabelProps>(
  function SankeyNodeLabel(props, ref) {
    const { node } = props;
    const theme = useTheme();

    if (!node.label || node.y0 === undefined || node.y1 === undefined) {
      return null; // No label or invalid coordinates, nothing to render
    }

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    // Determine label position
    const labelX =
      node.depth === 0
        ? x1 + 6 // Right side for first column
        : x0 - 6; // Left side for other columns

    const labelAnchor = node.depth === 0 ? 'start' : 'end';

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
        data-node={node.id}
      >
        {node.label}
      </text>
    );
  },
);
