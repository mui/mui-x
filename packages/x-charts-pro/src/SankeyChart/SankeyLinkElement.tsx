'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import { SankeyLayoutLink, type SankeyItemIdentifier } from './sankey.types';
import { useChartId } from '@mui/x-charts/hooks';

export interface SankeyLinkElementProps {
  /**
   * The series ID to which the link belongs
   */
  seriesId: SeriesId;
  /**
   * The link data
   */
  link: SankeyLayoutLink;
  /**
   * Color to apply to the link
   */
  color?: string;
  /**
   * Opacity to apply to the link
   */
  opacity?: number;
  /**
   * Handler for click events
   * @param {React.MouseEvent<SVGPathElement>} event - The click event
   * @param {SankeyLayoutLink} link - The link data
   */
  onClick?: (event: React.MouseEvent<SVGPathElement>, link: SankeyItemIdentifier) => void;
}

/**
 * @ignore - internal component.
 */
export const SankeyLinkElement = React.forwardRef<SVGPathElement, SankeyLinkElementProps>(
  function SankeyLinkElement(props, ref) {
    const { link, color, opacity = 0.4, onClick, seriesId } = props;
    const chartId = useChartId();

    const identifier: SankeyItemIdentifier = {
      type: 'sankey',
      seriesId,
      subType: 'link',
      link,
    };

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGPathElement>) => {
      if (onClick) {
        onClick(event, identifier);
      }
    });

    if (!link.path) {
      return null; // No path defined, nothing to render
    }

    const allY = [link.source.y0!, link.source.y1!, link.target.y0!, link.target.y1!];

    const targetWidth = link.target.x1! - link.target.x0!;
    const sourceWidth = link.source.x1! - link.source.x0!;

    const x0 = link.source.x1! - sourceWidth;
    const y0 = Math.max(...allY);
    const x1 = link.target.x0! + targetWidth;
    const y1 = Math.min(...allY);

    const clipId = `clip-${chartId}-${link.source.id}-${link.target.id}`;

    return (
      <>
        <defs>
          <clipPath id={clipId}>
            <path d={`M${x0},${y0} L${x1},${y0} L${x1},${y1} L${x0},${y1} Z`} />
          </clipPath>
        </defs>
        <path
          ref={ref}
          d={link.path}
          stroke={color || link.color}
          strokeWidth={link.width}
          strokeOpacity={opacity}
          data-link-source={link.source.id}
          data-link-target={link.target.id}
          onClick={onClick ? handleClick : undefined}
          cursor={onClick ? 'pointer' : 'default'}
          fill="none"
          clipPath={`url(#${clipId})`}
          {...interactionProps}
        />
      </>
    );
  },
);
