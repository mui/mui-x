'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import {
  SankeyLayout,
  type SankeyLinkIdentifierWithData,
  type SankeyNodeIdentifierWithData,
} from './sankey.types';
import { calculateSankeyLayout } from './calculateSankeyLayout';
import { SankeyNodeElement } from './SankeyNodeElement';
import { SankeyLinkElement } from './SankeyLinkElement';
import { SankeyLinkLabel } from './SankeyLinkLabel';
import { useSankeySeriesContext } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';

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

/**
 * Renders a Sankey diagram plot.
 */
function SankeyPlot(props: SankeyPlotProps) {
  const { classes: inputClasses, onLinkClick, onNodeClick } = props;

  const seriesContext = useSankeySeriesContext();

  if (!seriesContext) {
    throw new Error(
      `MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartDataProviderPro.`,
    );
  }

  const series = seriesContext.series[seriesContext.seriesOrder?.[0]];
  const classes = useUtilityClasses({ classes: inputClasses });
  const drawingArea = useDrawingArea();
  const { data, linkOptions, nodeOptions } = series;
  const theme = useTheme();

  // Calculate layout based on data and dimensions
  const layout: SankeyLayout = React.useMemo(
    () => calculateSankeyLayout(data, drawingArea, theme, series),
    [drawingArea, data, series, theme],
  );

  // Early return if no data or dimensions
  if (!data || !data.links) {
    return null;
  }

  return (
    <g className={classes.root}>
      <g className={classes.links}>
        {layout.links.map((link) => (
          <SankeyLinkElement
            seriesId={series.id}
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
            seriesId={series.id}
            key={node.id}
            node={node}
            showLabel={nodeOptions?.showLabels}
            onClick={onNodeClick}
          />
        ))}
      </g>

      {linkOptions?.showValues && (
        <g className={classes.linkLabels}>
          {layout.links.map((link) => (
            <SankeyLinkLabel key={`label-${link.source.id}-${link.target.id}`} link={link} />
          ))}
        </g>
      )}
    </g>
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
