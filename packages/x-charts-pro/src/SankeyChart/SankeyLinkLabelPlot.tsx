'use client';
import { SankeyLinkLabel } from './SankeyLinkLabel';
import { useSankeyLayout, useSankeySeries } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';

export interface SankeyLinkLabelPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;
}

function SankeyLinkLabelPlot(props: SankeyLinkLabelPlotProps) {
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
  if (!layout || !layout.links) {
    return null;
  }

  if (!sankeySeries.linkOptions?.showValues) {
    return null;
  }

  return (
    <g className={classes.linkLabels}>
      {layout.links.map((link) => (
        <SankeyLinkLabel key={`label-link-${link.source.id}-${link.target.id}`} link={link} />
      ))}
    </g>
  );
}

export { SankeyLinkLabelPlot };
