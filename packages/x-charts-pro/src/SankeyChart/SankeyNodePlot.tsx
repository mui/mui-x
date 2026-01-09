'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import type { SankeyNodeIdentifierWithData } from './sankey.types';
import { SankeyNodeElement } from './SankeyNodeElement';
import { useSankeyLayout, useSankeySeries } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';

export interface SankeyNodePlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    node: SankeyNodeIdentifierWithData,
  ) => void;
}

const SankeyNodePlotRoot = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
  '& [data-faded=true]': { filter: 'saturate(80%)' },
  '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});

function SankeyNodePlot(props: SankeyNodePlotProps) {
  const { classes: inputClasses, onClick } = props;

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

  return (
    <SankeyNodePlotRoot className={classes.nodes}>
      {layout.nodes.map((node) => (
        <SankeyNodeElement seriesId={sankeySeries.id} key={node.id} node={node} onClick={onClick} />
      ))}
    </SankeyNodePlotRoot>
  );
}

export { SankeyNodePlot };
