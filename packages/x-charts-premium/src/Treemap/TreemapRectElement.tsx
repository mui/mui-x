'use client';
import * as React from 'react';
import type { TreemapLayoutNode } from './treemap.types';
import { useUtilityClasses } from './treemapClasses';

export interface TreemapRectElementProps {
  /**
   * The layout node to render.
   */
  node: TreemapLayoutNode;
}

/**
 * @ignore - internal component.
 */
function TreemapRectElement(props: TreemapRectElementProps) {
  const { node } = props;

  const classes = useUtilityClasses();

  const width = node.x1 - node.x0;
  const height = node.y1 - node.y0;

  return (
    <rect
      x={node.x0}
      y={node.y0}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      fill={node.color}
      data-node={node.id}
      className={classes.cell}
    />
  );
}

const MemoTreemapRectElement = React.memo(TreemapRectElement);

export { MemoTreemapRectElement as TreemapRectElement };
