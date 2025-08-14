'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import { SankeyLayoutNode, type SankeyItemIdentifier } from './sankey.types';
import { useTheme } from '@mui/material/styles';

export interface SankeyNodeElementProps {
  /**
   * The series ID to which the node belongs
   */
  seriesId: SeriesId;
  /**
   * The node data
   */
  node: SankeyLayoutNode;
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

/**
 * @ignore - internal component.
 */
export const SankeyNodeElement = React.forwardRef<SVGGElement, SankeyNodeElementProps>(
  function SankeyNodeElement(props, ref) {
    const { node, showLabel = true, onClick, seriesId } = props;
    const theme = useTheme();

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    const nodeWidth = x1 - x0;
    const nodeHeight = y1 - y0;

    // Determine label position
    const labelX =
      node.depth === 0
        ? x1 + 6 // Right side for first column
        : x0 - 6; // Left side for other columns

    const labelAnchor = node.depth === 0 ? 'start' : 'end';

    const identifier: SankeyItemIdentifier = {
      type: 'sankey',
      seriesId,
      subType: 'node',
      node,
    };

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGRectElement>) => {
      if (onClick) {
        onClick(event, identifier);
      }
    });

    return (
      <g ref={ref} data-node={node.id}>
        <rect
          x={node.x0}
          y={node.y0}
          width={nodeWidth}
          height={nodeHeight}
          fill={node.color}
          onClick={onClick ? handleClick : undefined}
          cursor={onClick ? 'pointer' : 'default'}
          stroke="none"
          {...interactionProps}
        />

        {showLabel && node.label && (
          <text
            x={labelX}
            y={(y0 + y1) / 2}
            textAnchor={labelAnchor}
            fill={theme.palette.text.primary}
            fontSize={theme.typography.caption.fontSize}
            fontFamily={theme.typography.fontFamily}
            pointerEvents="none"
          >
            {node.label}
          </text>
        )}
      </g>
    );
  },
);
