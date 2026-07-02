'use client';
import PropTypes from 'prop-types';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';
import { TreemapLabel } from './TreemapLabel';

export interface TreemapLabelPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<TreemapClasses>;
}

function TreemapLabelPlot(props: TreemapLabelPlotProps) {
  const { classes: inputClasses } = props;

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

  const { nodeOptions } = treemapSeries;
  const showLabels = nodeOptions?.showLabels ?? true;
  if (showLabels === false) {
    return null;
  }

  const renderMode = nodeOptions?.renderMode ?? 'all';
  const isCustom = typeof showLabels === 'function';

  // Every rendered tile is labeled by default; a custom predicate takes full control.
  const shouldLabel = (node: (typeof layout.nodes)[number]) => (isCustom ? showLabels(node) : true);

  // Only tiles that are actually rendered can carry a label.
  const labelled = layout.nodes.filter(
    (node) => node.depth >= 1 && (renderMode === 'all' || node.height === 0) && shouldLabel(node),
  );

  return (
    <g className={classes.labels}>
      {labelled.map((node) => (
        <TreemapLabel key={`label-${node.id}`} seriesId={treemapSeries.id} node={node} />
      ))}
    </g>
  );
}

TreemapLabelPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
} as any;

export { TreemapLabelPlot };
