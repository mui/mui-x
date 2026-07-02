'use client';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';
import { TreemapRectPlot } from './TreemapRectPlot';

export interface TreemapPlotProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<TreemapClasses>;
}

const TreemapPlotRoot = styled('g', {
  name: 'MuiTreemap',
  slot: 'Root',
})({});

/**
 * Renders a treemap plot.
 */
function TreemapPlot(props: TreemapPlotProps) {
  const { className, classes: inputClasses } = props;

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

  return (
    <TreemapPlotRoot className={clsx(classes.root, className)}>
      <TreemapRectPlot classes={classes} />
    </TreemapPlotRoot>
  );
}

TreemapPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
} as any;

export { TreemapPlot };
