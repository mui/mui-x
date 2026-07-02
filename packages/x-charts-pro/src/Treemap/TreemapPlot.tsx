'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import type { TreemapItemIdentifierWithData } from './treemap.types';
import { useTreemapLayout, useTreemapSeries } from '../hooks/useTreemapSeries';
import { useUtilityClasses } from './treemapClasses';
import type { TreemapClasses } from './treemapClasses';
import { TreemapRectPlot } from './TreemapRectPlot';
import { TreemapLabelPlot } from './TreemapLabelPlot';

export interface TreemapPlotProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
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

const TreemapPlotRoot = styled('g', {
  name: 'MuiTreemap',
  slot: 'Root',
})({});

/**
 * Renders a treemap plot.
 */
function TreemapPlot(props: TreemapPlotProps) {
  const { className, classes: inputClasses, onItemClick } = props;

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

  const showLabels = treemapSeries.nodeOptions?.showLabels ?? true;

  return (
    <TreemapPlotRoot className={clsx(classes.root, className)}>
      <TreemapRectPlot classes={classes} onItemClick={onItemClick} />
      {showLabels !== false && <TreemapLabelPlot classes={classes} />}
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
  /**
   * Callback fired when a treemap tile is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {TreemapItemIdentifierWithData} item The treemap item identifier.
   */
  onItemClick: PropTypes.func,
} as any;

export { TreemapPlot };
