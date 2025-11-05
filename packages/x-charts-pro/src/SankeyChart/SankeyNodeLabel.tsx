'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useIsHydrated } from '@mui/x-charts/hooks';
import { SankeyLayoutNode } from './sankey.types';
import { splitStringForSvg } from './splitStringForSvg';

const NODE_PADDING = 6;

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
  function SankeyNodeLabel({ node }, ref) {
    const theme = useTheme();
    const isHydrated = useIsHydrated();

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    // Determine label position
    const labelX =
      node.depth === 0
        ? x1 + NODE_PADDING // Right side for first column
        : x0 - NODE_PADDING; // Left side for other columns

    const labelAnchor = node.depth === 0 ? ('start' as const) : ('end' as const);
    const areaWidth = node.nodeDistance - NODE_PADDING * 2;
    const styles = React.useMemo(
      () =>
        ({
          textAnchor: labelAnchor,
          fill: (theme.vars || theme).palette.text.primary,
          fontSize: theme.typography.caption.fontSize,
          fontFamily: theme.typography.fontFamily,
          pointerEvents: 'none',
          dominantBaseline: 'central',
        }) as const,
      [labelAnchor, theme],
    );

    const texts = React.useMemo(
      () =>
        !node.label
          ? { lines: [], lineHeight: 0 }
          : splitStringForSvg(node.label, areaWidth, isHydrated, styles),
      [node.label, areaWidth, isHydrated, styles],
    );

    if (!node.label) {
      return null; // No label or invalid coordinates, nothing to render
    }

    return (
      <text {...styles} ref={ref} x={labelX} y={(y0 + y1) / 2} data-node={node.id}>
        {texts.lines.map((text, index) => (
          <tspan
            key={index}
            x={labelX}
            y={(y0 + y1) / 2 - ((texts.lines.length - 1) * texts.lineHeight) / 2}
            dy={texts.lineHeight * index}
          >
            {text}
          </tspan>
        ))}
      </text>
    );
  },
);
