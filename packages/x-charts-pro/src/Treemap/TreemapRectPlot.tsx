'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { TreemapRectElement } from './TreemapRectElement';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
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
})({});

function TreemapRectPlot(props: TreemapRectPlotProps) {
  const { classes: inputClasses } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const treemapSeries = useTreemapSeries()[0];
  const layout = useTreemapLayout();

  // The (possibly synthetic) root at depth 0 is structural and never rendered.
  const renderableNodes = React.useMemo(
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
    <TreemapRectPlotRoot className={classes.cells}>
      {renderableNodes.map((node) => (
        <TreemapRectElement key={node.id} node={node} />
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
} as any;

export { TreemapRectPlot };
