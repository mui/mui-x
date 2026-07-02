'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import type { TreemapItemIdentifierWithData } from './treemap.types';
import { TreemapRectElement } from './TreemapRectElement';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';

export interface TreemapRectPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<TreemapClasses>;
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    item: TreemapItemIdentifierWithData,
  ) => void;
}

const TreemapRectPlotRoot = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
  '& [data-faded=true]': { filter: 'saturate(80%)' },
  '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});

function TreemapRectPlot(props: TreemapRectPlotProps) {
  const { classes: inputClasses, onItemClick } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const treemapSeries = useTreemapSeries()[0];
  const layout = useTreemapLayout();

  if (!treemapSeries) {
    throw new Error(
      `MUI X Charts: Treemap series context is missing. Ensure the TreemapPlot is used inside a properly configured ChartsDataProviderPro.`,
    );
  }

  if (!layout || !layout.nodes) {
    return null;
  }

  const renderMode = treemapSeries.nodeOptions?.renderMode ?? 'all';
  const borderRadius = treemapSeries.nodeOptions?.borderRadius;

  // The (possibly synthetic) root at depth 0 is structural and never rendered.
  const renderableNodes = layout.nodes.filter(
    (node) => node.depth >= 1 && (renderMode === 'all' || node.height === 0),
  );

  return (
    <TreemapRectPlotRoot className={classes.cells}>
      {renderableNodes.map((node) => (
        <TreemapRectElement
          key={node.id}
          seriesId={treemapSeries.id}
          node={node}
          borderRadius={borderRadius}
          onClick={onItemClick}
        />
      ))}
    </TreemapRectPlotRoot>
  );
}

TreemapRectPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick: PropTypes.func,
} as any;

export { TreemapRectPlot };
