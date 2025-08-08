'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { SankeyLayout, type SankeyItemIdentifier } from './sankey.types';
import { calculateSankeyLayout } from './calculateSankeyLayout';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';
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
   * @param {SankeyItemIdentifier} sankeyItemIdentifier The sankey item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    sankeyItemIdentifier: SankeyItemIdentifier,
  ) => void;
}

/**
 * Renders a Sankey diagram plot.
 */
export function SankeyPlot(props: SankeyPlotProps) {
  const { classes: inputClasses, onItemClick } = props;

  const seriesContext = useSankeySeriesContext();
  const series = seriesContext?.series[seriesContext?.seriesOrder?.[0]]!;
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
          <SankeyLink
            seriesId={series.id}
            key={`${link.source.id}-${link.target.id}`}
            link={link}
            opacity={linkOptions?.opacity}
            onClick={onItemClick}
          />
        ))}
      </g>

      <g className={classes.nodes}>
        {layout.nodes.map((node) => (
          <SankeyNode
            seriesId={series.id}
            key={node.id}
            node={node}
            showLabel={nodeOptions?.showLabels}
            onClick={onItemClick}
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
