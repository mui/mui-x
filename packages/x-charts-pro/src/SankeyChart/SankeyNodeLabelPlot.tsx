'use client';
import { useSankeyLayout, useSankeySeries } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';
import { SankeyNodeLabel } from './SankeyNodeLabel';

export interface SankeyNodeLabelPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;
}

function SankeyNodeLabelPlot(props: SankeyNodeLabelPlotProps) {
  const { classes: inputClasses } = props;

  const classes = useUtilityClasses({ classes: inputClasses });

  const sankeySeries = useSankeySeries()[0];
  const layout = useSankeyLayout();

  if (!sankeySeries) {
    throw new Error(
      `MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartDataProviderPro.`,
    );
  }

  // Early return if no data or dimensions
  if (!layout || !layout.nodes) {
    return null;
  }

  const showNodeLabels = sankeySeries.nodeOptions?.showLabels ?? true;
  if (!showNodeLabels) {
    return null;
  }

  return (
    <g className={classes.nodeLabels}>
      {layout.nodes.map((node) => (
        <SankeyNodeLabel key={`label-node-${node.id}`} node={node} />
      ))}
    </g>
  );
}

export { SankeyNodeLabelPlot };
