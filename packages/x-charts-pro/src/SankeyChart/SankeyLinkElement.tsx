'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import { SankeyLayoutLink, type SankeyItemIdentifierWithData } from './sankey.types';

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
   * Opacity to apply to the link
   */
  opacity?: number;
  /**
   * Handler for click events
   * @param {React.MouseEvent<SVGPathElement>} event - The click event
   * @param {SankeyLayoutLink} link - The link data
   */
  onClick?: (event: React.MouseEvent<SVGPathElement>, link: SankeyItemIdentifierWithData) => void;
}

/**
 * @ignore - internal component.
 */
export const SankeyLinkElement = React.forwardRef<SVGPathElement, SankeyLinkElementProps>(
  function SankeyLinkElement(props, ref) {
    const { link, opacity = 0.4, onClick, seriesId } = props;

    const identifier: SankeyItemIdentifierWithData = {
      type: 'sankey',
      seriesId,
      subType: 'link',
      targetId: link.target.id,
      sourceId: link.source.id,
      link,
    };

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGPathElement>) => {
      onClick?.(event, identifier);
    });

    if (!link.path) {
      return null; // No path defined, nothing to render
    }

    return (
      <path
        ref={ref}
        d={link.path}
        fill={link.color}
        opacity={opacity}
        data-link-source={link.source.id}
        data-link-target={link.target.id}
        onClick={onClick ? handleClick : undefined}
        cursor={onClick ? 'pointer' : 'default'}
        {...interactionProps}
      />
    );
  },
);
