'use client';
import * as React from 'react';
import type { TreemapLayoutNode } from './treemap.types';
import { useUtilityClasses } from './treemapClasses';

export interface TreemapRectElementProps {
  /**
   * The layout node to render.
   */
  node: TreemapLayoutNode;
  /**
   * The border radius of the tile in pixels.
   */
  borderRadius?: number;
  /**
   * Whether the tile is highlighted.
   */
  isHighlighted?: boolean;
  /**
   * Whether the tile is faded.
   */
  isFaded?: boolean;
}

/**
 * @ignore - internal component.
 */
function TreemapRectElement(props: TreemapRectElementProps) {
  const { node, borderRadius, isHighlighted, isFaded } = props;

  const classes = useUtilityClasses();

  const width = node.x1 - node.x0;
  const height = node.y1 - node.y0;

  return (
    <rect
      x={node.x0}
      y={node.y0}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      rx={borderRadius}
      fill={node.color}
      opacity={isFaded ? 0.3 : 1}
      stroke="none"
      data-highlighted={isHighlighted || undefined}
      data-faded={isFaded || undefined}
      data-node={node.id}
      data-depth={node.depth}
      className={classes.cell}
    />
  );
}

const MemoTreemapRectElement = React.memo(TreemapRectElement);

export { MemoTreemapRectElement as TreemapRectElement };
