'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  type SankeyLinkIdentifierWithData,
  type SankeyNodeIdentifierWithData,
} from './sankey.types';
import { useSankeyLayout, useSankeySeries } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';
import { SankeyNodePlot } from './SankeyNodePlot';
import { SankeyLinkPlot } from './SankeyLinkPlot';
import { SankeyNodeLabelPlot } from './SankeyNodeLabelPlot';
import { SankeyLinkLabelPlot } from './SankeyLinkLabelPlot';

export interface SankeyPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
   */
  onNodeClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    node: SankeyNodeIdentifierWithData,
  ) => void;
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
   */
  onLinkClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    link: SankeyLinkIdentifierWithData,
  ) => void;
}

const SankeyPlotRoot = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({});

/**
 * Renders a Sankey diagram plot.
 */
function SankeyPlot(props: SankeyPlotProps) {
  const { classes: inputClasses, onLinkClick, onNodeClick } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const sankeySeries = useSankeySeries()[0];
  const layout = useSankeyLayout();

  if (!sankeySeries) {
    throw new Error(
      `MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartDataProviderPro.`,
    );
  }

  // Early return if no data or dimensions
  if (!layout || !layout.links) {
    return null;
  }

  const { linkOptions, nodeOptions } = sankeySeries;

  const showNodeLabels = nodeOptions?.showLabels ?? true;
  return (
    <SankeyPlotRoot className={classes.root}>
      <SankeyNodePlot classes={classes} onClick={onNodeClick} />
      <SankeyLinkPlot classes={classes} onClick={onLinkClick} />

      {linkOptions?.showValues && <SankeyLinkLabelPlot classes={classes} />}
      {showNodeLabels && <SankeyNodeLabelPlot classes={classes} />}
    </SankeyPlotRoot>
  );
}

SankeyPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Classes applied to the various elements.
   */
  classes: PropTypes.object,
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
   */
  onLinkClick: PropTypes.func,
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
   */
  onNodeClick: PropTypes.func,
} as any;

export { SankeyPlot };
