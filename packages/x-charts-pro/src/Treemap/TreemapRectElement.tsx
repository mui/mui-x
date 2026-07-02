'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import type { TreemapLayoutNode, TreemapItemIdentifierWithData } from './treemap.types';
import { useTreemapItemHighlightState } from './treemapHighlightHooks';
import { useUtilityClasses } from './treemapClasses';

export interface TreemapRectElementProps {
  /**
   * The series id the node belongs to.
   */
  seriesId: SeriesId;
  /**
   * The layout node to render.
   */
  node: TreemapLayoutNode;
  /**
   * The border radius of the tile in pixels.
   */
  borderRadius?: number;
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    item: TreemapItemIdentifierWithData,
  ) => void;
}

/**
 * @ignore - internal component.
 */
export const TreemapRectElement = React.forwardRef<SVGRectElement, TreemapRectElementProps>(
  function TreemapRectElement(props, ref) {
    const { node, onClick, seriesId, borderRadius } = props;

    const width = node.x1 - node.x0;
    const height = node.y1 - node.y0;

    const identifier: TreemapItemIdentifierWithData = {
      type: 'treemap',
      seriesId,
      nodeId: node.id,
      node,
    };

    const highlightState = useTreemapItemHighlightState(identifier);
    const isFaded = highlightState === 'faded';
    const isHighlighted = highlightState === 'highlighted';

    const interactionProps = useInteractionItemProps(identifier);
    const classes = useUtilityClasses();

    const handleClick = useEventCallback((event: React.MouseEvent<SVGRectElement>) => {
      onClick?.(event, identifier);
    });

    return (
      <rect
        x={node.x0}
        y={node.y0}
        width={Math.max(0, width)}
        height={Math.max(0, height)}
        rx={borderRadius}
        fill={node.color}
        opacity={isFaded ? 0.3 : 1}
        onClick={onClick ? handleClick : undefined}
        cursor={onClick ? 'pointer' : 'default'}
        stroke="none"
        data-highlighted={isHighlighted || undefined}
        data-faded={isFaded || undefined}
        ref={ref}
        data-node={node.id}
        className={classes.cell}
        {...interactionProps}
      />
    );
  },
);
