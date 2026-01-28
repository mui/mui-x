'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps, useStore } from '@mui/x-charts/internals';
import type { SankeyLayoutNode, SankeyNodeIdentifierWithData } from './sankey.types';
import { selectorIsNodeHighlighted } from './plugins';
import { selectorIsSankeyItemFaded } from './plugins/useSankeyHighlight.selectors';

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
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    node: SankeyNodeIdentifierWithData,
  ) => void;
}

/**
 * @ignore - internal component.
 */
export const SankeyNodeElement = React.forwardRef<SVGGElement, SankeyNodeElementProps>(
  function SankeyNodeElement(props, ref) {
    const { node, onClick, seriesId } = props;
    const store = useStore();

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    const nodeWidth = x1 - x0;
    const nodeHeight = y1 - y0;

    const identifier: SankeyNodeIdentifierWithData = {
      type: 'sankey',
      seriesId,
      subType: 'node',
      nodeId: node.id,
      node,
    };

    const isHighlighted = store.use(selectorIsNodeHighlighted, node.id);
    const isFaded = store.use(selectorIsSankeyItemFaded, isHighlighted);

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGRectElement>) => {
      onClick?.(event, identifier);
    });

    let opacity = 1;
    if (isFaded) {
      opacity = 0.3;
    } else if (isHighlighted) {
      opacity = 1;
    }

    return (
      <g ref={ref} data-node={node.id}>
        <rect
          x={node.x0}
          y={node.y0}
          width={nodeWidth}
          height={nodeHeight}
          fill={node.color}
          opacity={opacity}
          onClick={onClick ? handleClick : undefined}
          cursor={onClick ? 'pointer' : 'default'}
          stroke="none"
          data-highlighted={isHighlighted || undefined}
          data-faded={isFaded || undefined}
          {...interactionProps}
        />
      </g>
    );
  },
);
