'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { TreemapRectElement } from './TreemapRectElement';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useTreemapHighlightGetter } from './treemapHighlightHooks';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';

export interface TreemapRectPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<TreemapClasses>;
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
  const { classes: inputClasses } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const treemapSeries = useTreemapSeries()[0];
  const layout = useTreemapLayout();
  const getHighlightState = useTreemapHighlightGetter();

  const renderMode = treemapSeries?.nodeOptions?.renderMode ?? 'all';
  // The (possibly synthetic) root at depth 0 is structural and never rendered.
  const renderableNodes = React.useMemo(
    () =>
      (layout?.nodes ?? []).filter(
        (node) => node.depth >= 1 && (renderMode === 'all' || node.height === 0),
      ),
    [layout, renderMode],
  );

  if (!treemapSeries) {
    throw new Error(
      `MUI X Charts: Treemap series context is missing. Ensure the TreemapPlot is used inside a properly configured ChartsDataProviderPro.`,
    );
  }

  if (!layout || !layout.nodes) {
    return null;
  }

  const borderRadius = treemapSeries.nodeOptions?.borderRadius;

  return (
    <TreemapRectPlotRoot className={classes.cells}>
      {renderableNodes.map((node) => {
        const highlightState = getHighlightState(node.id);
        return (
          <TreemapRectElement
            key={node.id}
            node={node}
            borderRadius={borderRadius}
            isHighlighted={highlightState === 'highlighted'}
            isFaded={highlightState === 'faded'}
          />
        );
      })}
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
} as any;

export { TreemapRectPlot };
