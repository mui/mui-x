'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId, UseChartHighlightSignature } from '@mui/x-charts/internals';
import {
  selectorChartsIsFaded,
  selectorChartsIsHighlighted,
  useInteractionItemProps,
  useStore,
} from '@mui/x-charts/internals';
import type {
  SankeyItemIdentifier,
  SankeyLayoutLink,
  SankeyLinkIdentifierWithData,
} from './sankey.types';

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
    const store = useStore<[UseChartHighlightSignature<'sankey'>]>();

    const identifier: SankeyLinkIdentifierWithData = {
      type: 'sankey',
      seriesId,
      subType: 'link',
      targetId: link.target.id,
      sourceId: link.source.id,
      link,
    };

    const isHighlighted = store.use(
      selectorChartsIsHighlighted as unknown as (
        state: any,
        identifier: SankeyItemIdentifier,
      ) => boolean,
      identifier,
    );
    const isFaded = store.use(
      selectorChartsIsFaded as unknown as (state: any, identifier: SankeyItemIdentifier) => boolean,
      identifier,
    );

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps<'sankey'>(identifier);

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
