'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  type SankeyLinkIdentifierWithData,
  type SankeyNodeIdentifierWithData,
} from './sankey.types';
import { SankeyNodeElement } from './SankeyNodeElement';
import { SankeyLinkElement } from './SankeyLinkElement';
import { SankeyLinkLabel } from './SankeyLinkLabel';
import { useSankeyLayout, useSankeySeriesContext } from '../hooks/useSankeySeries';
import { sankeyPlotClasses, useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';
import { SankeyNodeLabel } from './SankeyNodeLabel';

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
})({
  [`.${sankeyPlotClasses.links} path, .${sankeyPlotClasses.nodes} rect`]: {
    transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
  },
  '& [data-faded=true]': { filter: 'saturate(80%)' },
  '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});

/**
 * Renders a Sankey diagram plot.
 */
function SankeyPlot(props: SankeyPlotProps) {
  const { classes: inputClasses, onLinkClick, onNodeClick } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const sankeyContext = useSankeySeriesContext();
  const sankeySeries = sankeyContext?.series[sankeyContext?.seriesOrder[0]];
  const layout = useSankeyLayout();

  if (!sankeySeries) {
    throw new Error(
      `MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartDataProviderPro.`,
    );
  }

  if (!layout || !layout.links) {
    return null;
  }

  const { linkOptions, nodeOptions } = sankeySeries;
  // Early return if no data or dimensions

  const showNodeLabels = nodeOptions?.showLabels ?? true;
  return (
    <SankeyPlotRoot className={classes.root}>
      <g className={classes.links}>
        {layout.links.map((link) => (
          <SankeyLinkElement
            seriesId={sankeySeries.id}
            key={`${link.source.id}-${link.target.id}`}
            link={link}
            opacity={linkOptions?.opacity}
            onClick={onLinkClick}
          />
        ))}
      </g>

      <g className={classes.nodes}>
        {layout.nodes.map((node) => (
          <SankeyNodeElement
            seriesId={sankeySeries.id}
            key={node.id}
            node={node}
            onClick={onNodeClick}
          />
        ))}
      </g>

      {linkOptions?.showValues && (
        <g className={classes.linkLabels}>
          {layout.links.map((link) => (
            <SankeyLinkLabel key={`label-link-${link.source.id}-${link.target.id}`} link={link} />
          ))}
        </g>
      )}

      {showNodeLabels && (
        <g className={classes.nodeLabels}>
          {layout.nodes.map((node) => (
            <SankeyNodeLabel key={`label-node-${node.id}`} node={node} />
          ))}
        </g>
      )}
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
