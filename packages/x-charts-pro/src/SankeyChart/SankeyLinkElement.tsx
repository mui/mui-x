'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import { useChartStore, useInteractionItemProps } from '@mui/x-charts/internals';
import { useStore } from '@mui/x-internals/store';
import type { SankeyLayoutLink, SankeyLinkIdentifierWithData } from './sankey.types';
import { selectorIsLinkHighlighted } from './plugins';
import { selectorIsSankeyItemFaded } from './plugins/useSankeyHighlight.selectors';

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
   * Callback fired when a sankey item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    link: SankeyLinkIdentifierWithData,
  ) => void;
}

/**
 * @ignore - internal component.
 */
export const SankeyLinkElement = React.forwardRef<SVGPathElement, SankeyLinkElementProps>(
  function SankeyLinkElement(props, ref) {
    const { link, opacity = 0.4, onClick, seriesId } = props;
    const store = useChartStore();

    const identifier: SankeyLinkIdentifierWithData = {
      type: 'sankey',
      seriesId,
      subType: 'link',
      targetId: link.target.id,
      sourceId: link.source.id,
      link,
    };

    const isHighlighted = useStore(store, selectorIsLinkHighlighted, link);
    const isFaded = useStore(store, selectorIsSankeyItemFaded, isHighlighted);

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGPathElement>) => {
      onClick?.(event, identifier);
    });

    if (!link.path) {
      return null;
    }

    let finalOpacity = opacity;
    if (isFaded) {
      finalOpacity = opacity * 0.3;
    } else if (isHighlighted) {
      finalOpacity = Math.min(opacity * 1.2, 1);
    }

    return (
      <path
        ref={ref}
        d={link.path}
        fill={link.color}
        opacity={finalOpacity}
        data-link-source={link.source.id}
        data-link-target={link.target.id}
        data-highlighted={isHighlighted || undefined}
        data-faded={isFaded || undefined}
        onClick={onClick ? handleClick : undefined}
        cursor={onClick ? 'pointer' : 'default'}
        {...interactionProps}
      />
    );
  },
);
