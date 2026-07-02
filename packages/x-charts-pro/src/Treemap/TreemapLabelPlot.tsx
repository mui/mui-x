'use client';
import * as React from 'react';
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

/**
 * @ignore - internal component.
 */
function TreemapLabelPlot(props: TreemapLabelPlotProps) {
  const { classes: inputClasses } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const treemapSeries = useTreemapSeries()[0];
  const layout = useTreemapLayout();

  // The (possibly synthetic) root at depth 0 is structural and never labeled.
  const labelled = React.useMemo(
    () => (layout?.nodes ?? []).filter((node) => node.depth >= 1),
    [layout],
  );

  if (!treemapSeries) {
    throw new Error(
      `MUI X Charts: Treemap series context is missing. Ensure the TreemapPlot is used inside a properly configured ChartsDataProviderPro.`,
    );
  }

  if (!layout || !layout.nodes) {
    return null;
  }

  return (
    <g className={classes.labels}>
      {labelled.map((node) => (
        <TreemapLabel key={`label-${node.id}`} node={node} />
      ))}
    </g>
  );
}

export { TreemapLabelPlot };
