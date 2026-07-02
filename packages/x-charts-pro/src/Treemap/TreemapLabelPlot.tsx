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
  if ((nodeOptions?.showLabels ?? true) === false) {
    return null;
  }

  const minLabelWidth = nodeOptions?.minLabelWidth ?? 30;
  const minLabelHeight = nodeOptions?.minLabelHeight ?? 18;

  // Labels are placed on leaf tiles, which are painted on top and are never covered.
  const leaves = layout.nodes.filter((node) => node.height === 0 && node.depth >= 1);

  return (
    <g className={classes.labels}>
      {leaves.map((node) => (
        <TreemapLabel
          key={`label-${node.id}`}
          seriesId={treemapSeries.id}
          node={node}
          minLabelWidth={minLabelWidth}
          minLabelHeight={minLabelHeight}
        />
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
