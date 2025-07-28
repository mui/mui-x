'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useTheme } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { SankeyLayout, type SankeyItemIdentifier } from './sankey.types';
import { calculateSankeyLayout } from './calculateSankeyLayout';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';
import { useSankeySeriesContext } from '../hooks/useSankeySeries';

export interface SankeyPlotClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the nodes container. */
  nodes: string;
  /** Styles applied to the links container. */
  links: string;
}

export type SankeyPlotClassKey = keyof SankeyPlotClasses;

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

export function getSankeyPlotUtilityClass(slot: string) {
  return generateUtilityClass('MuiSankeyPlot', slot);
}

export const sankeyPlotClasses: SankeyPlotClasses = generateUtilityClasses('MuiSankeyPlot', [
  'root',
  'nodes',
  'links',
]);

const useUtilityClasses = (ownerState: { classes?: Partial<SankeyPlotClasses> }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    nodes: ['nodes'],
    links: ['links'],
  };

  return composeClasses(slots, getSankeyPlotUtilityClass, classes);
};

/**
 * Renders a Sankey diagram plot.
 */
export function SankeyPlot(props: SankeyPlotProps) {
  const { classes: inputClasses, onItemClick } = props;

  const seriesContext = useSankeySeriesContext();
  const series = seriesContext?.series[seriesContext?.seriesOrder?.[0]]!;
  const classes = useUtilityClasses({ classes: inputClasses });
  const drawingArea = useDrawingArea();
  const {
    data,
    nodeWidth,
    nodeGap,
    iterations,
    linkColor,
    linkOpacity,
    showNodeLabels,
    nodeColor,
  } = series;
  const theme = useTheme();

  // Calculate layout based on data and dimensions
  const layout: SankeyLayout = React.useMemo(
    () => calculateSankeyLayout(data, drawingArea, nodeWidth, nodeGap, iterations),
    [drawingArea, data, nodeWidth, nodeGap, iterations],
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
            color={link.color || linkColor || theme.palette.primary.light}
            opacity={linkOpacity}
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
            color={node.color || nodeColor || theme.palette.primary.main}
            showLabel={showNodeLabels}
            onClick={onItemClick}
          />
        ))}
      </g>
    </g>
  );
}
