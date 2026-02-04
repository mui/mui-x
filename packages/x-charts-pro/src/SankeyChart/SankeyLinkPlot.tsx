'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import type { SankeyLinkIdentifierWithData } from './sankey.types';
import { SankeyLinkElement } from './SankeyLinkElement';
import { useSankeyLayout, useSankeySeries } from '../hooks/useSankeySeries';
import { useUtilityClasses, type SankeyPlotClasses } from './sankeyClasses';

export interface SankeyLinkPlotProps {
  /**
   * Classes applied to the various elements.
   */
  classes?: Partial<SankeyPlotClasses>;
  /**
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    link: SankeyLinkIdentifierWithData,
  ) => void;
}

const SankeyLinkPlotRoot = styled('g', {
  slot: 'internal',
  shouldForwardProp: undefined,
})({
  transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
  '& [data-faded=true]': { filter: 'saturate(80%)' },
  '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});

function SankeyLinkPlot(props: SankeyLinkPlotProps) {
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
  if (!layout || !layout.links) {
    return null;
  }

  return (
    <SankeyLinkPlotRoot className={classes.links}>
      {layout.links.map((link) => (
        <SankeyLinkElement
          seriesId={sankeySeries.id}
          key={`${link.source.id}-${link.target.id}`}
          link={link}
          opacity={sankeySeries?.linkOptions?.opacity}
          onClick={onClick}
        />
      ))}
    </SankeyLinkPlotRoot>
  );
}

export { SankeyLinkPlot };
