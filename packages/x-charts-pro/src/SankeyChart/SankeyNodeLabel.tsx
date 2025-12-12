'use client';
import * as React from 'react';
import { useStore, useSelector } from '@mui/x-charts/internals';
import { useTheme } from '@mui/material/styles';
import type { SankeyLayoutNode } from './sankey.types';
import { selectorIsNodeHighlighted } from './plugins';
import { selectorIsSankeyItemFaded } from './plugins/useSankeyHighlight.selectors';

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
    const store = useStore();

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

    const isHighlighted = useSelector(store, selectorIsNodeHighlighted, node.id);
    const isFaded = useSelector(store, selectorIsSankeyItemFaded, isHighlighted);

    let opacity = 1;
    if (isFaded) {
      opacity = 0.3;
    } else if (isHighlighted) {
      opacity = 1;
    }

    if (!node.label) {
      return null;
    }

    return (
      <foreignObject
        x={labelX}
        y={(y0 + y1) / 2}
        width={1}
        height={1}
        overflow="visible"
        data-node={node.id}
        data-highlighted={isHighlighted || undefined}
        data-faded={isFaded || undefined}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: `flex-${labelAnchor}`,
            overflow: 'visible',
          }}
        >
          <div
            style={{
              textAnchor: labelAnchor,
              fontSize: theme.typography.caption.fontSize,
              fontFamily: theme.typography.fontFamily,
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                opacity: 0.3,
                background: node.color,
                left: -2,
                right: -2,
                top: -2,
                bottom: -2,
                borderRadius: 4,
              }}
            />
            <span>{node.label}</span>
          </div>
        </div>
      </foreignObject>
    );
  },
);
