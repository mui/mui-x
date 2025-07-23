'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { SankeyLayoutNode, type SankeyItemIdentifier } from './sankey.types';

const SankeyNodeRoot = styled('rect')(({ onClick }) => ({
  stroke: 'none',
  cursor: onClick ? 'pointer' : 'default',
  '&:hover': {
    opacity: 0.8,
  },
}));

const SankeyNodeLabel = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  fontSize: '0.75rem',
  fontWeight: 'normal',
  dominantBaseline: 'middle',
  pointerEvents: 'none',
}));

export interface SankeyNodeProps {
  /**
   * The series ID to which the node belongs
   */
  seriesId: SeriesId;
  /**
   * The node data
   */
  node: SankeyLayoutNode;
  /**
   * Color to apply to the node
   */
  color?: string;
  /**
   * Whether to show the node label
   */
  showLabel?: boolean;
  /**
   * Handler for click events
   * @param {React.MouseEvent<SVGRectElement>} event - The click event
   * @param {SankeyLayoutNode} node - The node data
   */
  onClick?: (event: React.MouseEvent<SVGRectElement>, node: SankeyItemIdentifier) => void;
}

export const SankeyNode = React.forwardRef<SVGGElement, SankeyNodeProps>(
  function SankeyNode(props, ref) {
    const { node, color, showLabel = true, onClick, seriesId } = props;

    const nodeWidth = node.x1 - node.x0;
    const nodeHeight = node.y1 - node.y0;

    // Determine label position
    const labelX =
      node.depth === 0
        ? node.x1 + 6 // Right side for first column
        : node.x0 - 6; // Left side for other columns

    const labelAnchor = node.depth === 0 ? 'start' : 'end';

    const handleClick = useEventCallback((event: React.MouseEvent<SVGRectElement>) => {
      if (onClick) {
        onClick(event, {
          type: 'sankey',
          subType: 'link',
          id: node.id,
          seriesId,
        });
      }
    });

    return (
      <g ref={ref}>
        <SankeyNodeRoot
          x={node.x0}
          y={node.y0}
          width={nodeWidth}
          height={nodeHeight}
          fill={color || node.color}
          onClick={onClick ? handleClick : undefined}
          data-testid={`sankey-node-${node.id}`}
        />

        {showLabel && node.label && (
          <SankeyNodeLabel
            x={labelX}
            y={(node.y0 + node.y1) / 2}
            textAnchor={labelAnchor}
            data-testid={`sankey-node-label-${node.id}`}
          >
            {node.label}
          </SankeyNodeLabel>
        )}
      </g>
    );
  },
);
