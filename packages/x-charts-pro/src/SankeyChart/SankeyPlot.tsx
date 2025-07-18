'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useTheme } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { SankeyValueType, SankeyLayout, SankeyLayoutLink, SankeyLayoutNode } from './sankey.types';
import { calculateSankeyLayout } from './sankeyLayout';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';

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
   * The data to be displayed.
   */
  data: SankeyValueType;

  /**
   * Default color for nodes without specified colors.
   */
  nodeColor?: string;

  /**
   * Default color for links without specified colors.
   */
  linkColor?: string;

  /**
   * Default opacity for links.
   */
  linkOpacity?: number;

  /**
   * Gap between nodes in the same column.
   */
  nodeGap?: number;

  /**
   * Width of each node.
   */
  nodeWidth?: number;

  /**
   * Whether to show node labels.
   */
  showNodeLabels?: boolean;

  /**
   * Number of iterations for the layout algorithm.
   */
  iterations?: number;

  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;

  /**
   * Handler for node click events.
   * @param {React.MouseEvent<SVGRectElement>} event - The click event
   * @param {SankeyLayoutNode} node - The node data
   */
  onNodeClick?: (event: React.MouseEvent<SVGRectElement>, node: SankeyLayoutNode) => void;

  /**
   * Handler for node mouse enter events.
   * @param {React.MouseEvent<SVGRectElement>} event - The mouse enter event
   * @param {SankeyLayoutNode} node - The node data
   */
  onNodeMouseEnter?: (event: React.MouseEvent<SVGRectElement>, node: SankeyLayoutNode) => void;

  /**
   * Handler for node mouse leave events.
   * @param {React.MouseEvent<SVGRectElement>} event - The mouse leave event
   * @param {SankeyLayoutNode} node - The node data
   */
  onNodeMouseLeave?: (event: React.MouseEvent<SVGRectElement>, node: SankeyLayoutNode) => void;

  /**
   * Handler for link click events.
   * @param {React.MouseEvent<SVGPathElement>} event - The click event
   * @param {SankeyLayoutLink} link - The link data
   */
  onLinkClick?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;

  /**
   * Handler for link mouse enter events.
   * @param {React.MouseEvent<SVGPathElement>} event - The mouse enter event
   * @param {SankeyLayoutLink} link - The link data
   */
  onLinkMouseEnter?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;

  /**
   * Handler for link mouse leave events.
   * @param {React.MouseEvent<SVGPathElement>} event - The mouse leave event
   * @param {SankeyLayoutLink} link - The link data
   */
  onLinkMouseLeave?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;
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
  const {
    data,
    nodeColor,
    linkColor,
    linkOpacity = 0.4,
    nodeGap = 10,
    nodeWidth = 15,
    showNodeLabels = true,
    iterations = 32,
    className,
    classes: inputClasses,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onLinkClick,
    onLinkMouseEnter,
    onLinkMouseLeave,
  } = props;

  const classes = useUtilityClasses({ classes: inputClasses });
  const { width, height } = useDrawingArea();
  const theme = useTheme();

  // Calculate layout based on data and dimensions
  const layout: SankeyLayout = React.useMemo(
    () => calculateSankeyLayout(data, width, height, nodeWidth, nodeGap, iterations),
    [data, width, height, nodeWidth, nodeGap, iterations],
  );

  // Early return if no data or dimensions
  if (
    !data ||
    !data.nodes ||
    !data.links ||
    data.nodes.length === 0 ||
    width === 0 ||
    height === 0
  ) {
    return null;
  }

  return (
    <g className={classes.root}>
      <g className={classes.links}>
        {layout.links.map((link) => (
          <SankeyLink
            key={`${link.source}-${link.target}`}
            link={link}
            color={link.color || linkColor || theme.palette.primary.light}
            opacity={linkOpacity}
            onClick={onLinkClick}
            onMouseEnter={onLinkMouseEnter}
            onMouseLeave={onLinkMouseLeave}
          />
        ))}
      </g>

      <g className={classes.nodes}>
        {layout.nodes.map((node) => (
          <SankeyNode
            key={node.id}
            node={node}
            color={node.color || nodeColor || theme.palette.primary.main}
            showLabel={showNodeLabels}
            onClick={onNodeClick}
            onMouseEnter={onNodeMouseEnter}
            onMouseLeave={onNodeMouseLeave}
          />
        ))}
      </g>
    </g>
  );
}
