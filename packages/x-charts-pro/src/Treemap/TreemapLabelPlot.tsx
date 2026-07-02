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

  const minLabelWidth = nodeOptions?.minLabelWidth ?? 30;
  const minLabelHeight = nodeOptions?.minLabelHeight ?? 18;
  const renderMode = nodeOptions?.renderMode ?? 'all';
  const isCustom = typeof showLabels === 'function';

  // The root layer (depth 1) is always labeled; a custom predicate takes full control.
  const shouldLabel = (node: (typeof layout.nodes)[number]) =>
    isCustom ? showLabels(node) : node.depth === 1 || node.height === 0;

  // Only tiles that are actually rendered can carry a label.
  const labelled = layout.nodes.filter(
    (node) => node.depth >= 1 && (renderMode === 'all' || node.height === 0) && shouldLabel(node),
  );

  return (
    <g className={classes.labels}>
      {labelled.map((node) => {
        // Root-layer and explicitly-selected labels ignore the size thresholds.
        const alwaysShow = isCustom || node.depth === 1;
        return (
          <TreemapLabel
            key={`label-${node.id}`}
            seriesId={treemapSeries.id}
            node={node}
            minLabelWidth={alwaysShow ? 0 : minLabelWidth}
            minLabelHeight={alwaysShow ? 0 : minLabelHeight}
          />
        );
      })}
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
