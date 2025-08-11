'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import { SankeyLayoutLink, type SankeyItemIdentifier } from './sankey.types';

const SankeyLinkRoot = styled('path')(({ onClick }) => ({
  fill: 'none',
  transition: 'stroke-opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  cursor: onClick ? 'pointer' : 'default',
}));

export interface SankeyLinkProps {
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
export const SankeyLink = React.forwardRef<SVGPathElement, SankeyLinkProps>(
  function SankeyLink(props, ref) {
    const { link, color, opacity = 0.4, onClick, seriesId } = props;

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

    return (
      <SankeyLinkRoot
        ref={ref}
        d={link.path}
        stroke={color || link.color}
        strokeWidth={link.width}
        strokeOpacity={opacity}
        onClick={onClick ? handleClick : undefined}
        {...interactionProps}
      />
    );
  },
);
