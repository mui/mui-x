'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { type SankeyLayoutLink } from './sankey.types';
import { useSankeySeries } from '../hooks/useSankeySeries';

export interface SankeyLinkLabelProps {
  /**
   * The link data
   */
  link: SankeyLayoutLink;
}

const getLinkMidpoint = (link: SankeyLayoutLink) => {
  if (link.y0 === undefined || link.y1 === undefined) {
    return { x: 0, y: 0 };
  }

  // For Sankey links, we can calculate the midpoint using the source and target positions
  const sourceX = link.source.x1 || 0;
  const sourceY = (link.y0 + link.y1) / 2;
  const targetX = link.target.x0 || 0;
  const targetY = (link.y0 + link.y1) / 2;

  return {
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
  };
};

/**
 * @ignore - internal component.
 */
export const SankeyLinkLabel = React.forwardRef<SVGTextElement, SankeyLinkLabelProps>(
  function SankeyLinkLabel(props, ref) {
    const { link } = props;
    const theme = useTheme();
    const series = useSankeySeries()[0];

    if (!link.path || link.y0 === undefined || link.y1 === undefined) {
      return null; // No path defined or invalid coordinates, nothing to render
    }

    const midpoint = getLinkMidpoint(link);

    // Get the series data and valueFormatter
    const formattedValue = series?.valueFormatter
      ? series.valueFormatter(link.value, {
          type: 'link',
          sourceId: link.source.id,
          targetId: link.target.id,
          location: 'label',
        })
      : link.value;

    return (
      <text
        ref={ref}
        x={midpoint.x}
        y={midpoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={theme.typography.caption.fontSize}
        fill={(theme.vars || theme).palette.text.primary}
        data-link-source={link.source.id}
        data-link-target={link.target.id}
        fontFamily={theme.typography.fontFamily}
        pointerEvents="none"
      >
        {formattedValue}
      </text>
    );
  },
);
