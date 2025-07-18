'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { SankeyLayoutLink } from './sankey.types';

const SankeyLinkRoot = styled('path')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.primary.light,
  strokeOpacity: 0.4,
  transition: 'stroke-opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&:hover': {
    strokeOpacity: 0.7,
  },
}));

export interface SankeyLinkProps {
  /**
   * The link data
   * @type {SankeyLayoutLink}
   */
  link: SankeyLayoutLink;

  /**
   * Color to apply to the link
   * @type {string | undefined}
   */
  color?: string;

  /**
   * Opacity to apply to the link
   * @type {number | undefined}
   */
  opacity?: number;

  /**
   * Handler for click events
   * @param {React.MouseEvent<SVGPathElement>} event - The click event
   * @param {SankeyLayoutLink} link - The link data
   */
  onClick?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;

  /**
   * Handler for mouse enter events
   * @param {React.MouseEvent<SVGPathElement>} event - The mouse enter event
   * @param {SankeyLayoutLink} link - The link data
   */
  onMouseEnter?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;

  /**
   * Handler for mouse leave events
   * @param {React.MouseEvent<SVGPathElement>} event - The mouse leave event
   * @param {SankeyLayoutLink} link - The link data
   */
  onMouseLeave?: (event: React.MouseEvent<SVGPathElement>, link: SankeyLayoutLink) => void;
}

export const SankeyLink = React.forwardRef<SVGPathElement, SankeyLinkProps>(
  function SankeyLink(props, ref) {
    const { link, color, opacity = 0.4, onClick, onMouseEnter, onMouseLeave } = props;

    const handleClick = (event: React.MouseEvent<SVGPathElement>) => {
      if (onClick) {
        onClick(event, link);
      }
    };

    const handleMouseEnter = (event: React.MouseEvent<SVGPathElement>) => {
      if (onMouseEnter) {
        onMouseEnter(event, link);
      }
    };

    const handleMouseLeave = (event: React.MouseEvent<SVGPathElement>) => {
      if (onMouseLeave) {
        onMouseLeave(event, link);
      }
    };

    return (
      <SankeyLinkRoot
        ref={ref}
        d={link.path}
        stroke={color || link.color}
        strokeWidth={link.width}
        strokeOpacity={opacity}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid={`sankey-link-${link.source}-${link.target}`}
      />
    );
  },
);
