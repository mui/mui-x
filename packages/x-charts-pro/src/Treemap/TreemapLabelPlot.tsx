'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useTreemapHighlightGetter } from './treemapHighlightHooks';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';
import { TreemapLabel } from './TreemapLabel';
import { resolveLabelPadding } from './utils';

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
  const getHighlightState = useTreemapHighlightGetter();

  const nodeOptions = treemapSeries?.nodeOptions;
  const showLabels = nodeOptions?.showLabels ?? true;
  const renderMode = nodeOptions?.renderMode ?? 'all';
  const labelPadding = resolveLabelPadding(nodeOptions?.labelPadding);

  // Every rendered tile is labeled by default; a custom predicate takes full control.
  const labelled = React.useMemo(() => {
    if (showLabels === false) {
      return [];
    }
    const isCustom = typeof showLabels === 'function';
    return (layout?.nodes ?? []).filter(
      (node) =>
        node.depth >= 1 &&
        (renderMode === 'all' || node.height === 0) &&
        (isCustom ? showLabels(node) : true),
    );
  }, [layout, renderMode, showLabels]);

  if (!treemapSeries) {
    throw new Error(
      `MUI X Charts: Treemap series context is missing. Ensure the TreemapPlot is used inside a properly configured ChartsDataProviderPro.`,
    );
  }

  if (!layout || !layout.nodes || showLabels === false) {
    return null;
  }

  return (
    <g className={classes.labels}>
      {labelled.map((node) => (
        <TreemapLabel
          key={`label-${node.id}`}
          node={node}
          paddingX={labelPadding.x}
          paddingY={labelPadding.y}
          isFaded={getHighlightState(node.id) === 'faded'}
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
