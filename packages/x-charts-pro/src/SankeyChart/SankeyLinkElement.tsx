'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import type { SeriesId } from '@mui/x-charts/internals';
import {
  useInteractionItemProps,
  useStore,
  useSelector,
  selectorChartsHighlightedItem,
} from '@mui/x-charts/internals';
import type {
  SankeyLayoutLink,
  SankeyLinkIdentifierWithData,
  SankeyItemIdentifier,
  SankeyNodeOptions,
  SankeyLinkOptions,
} from './sankey.types';
import { isLinkHighlighted, isLinkHighlightedByNode, shouldFadeItem } from './utils';

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
   * Node options for highlighting configuration
   */
  nodeOptions?: SankeyNodeOptions;
  /**
   * Link options for highlighting configuration
   */
  linkOptions?: SankeyLinkOptions;
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
    const { link, opacity = 0.4, onClick, seriesId, nodeOptions, linkOptions } = props;
    const store = useStore();

    const highlightedItem = useSelector(
      store,
      selectorChartsHighlightedItem,
    ) as SankeyItemIdentifier | null;

    const identifier: SankeyLinkIdentifierWithData = {
      type: 'sankey',
      seriesId,
      subType: 'link',
      targetId: link.target.id,
      sourceId: link.source.id,
      link,
    };

    const highlighted =
      isLinkHighlighted(highlightedItem, link, linkOptions) ||
      isLinkHighlightedByNode(highlightedItem, link, nodeOptions);

    const faded = shouldFadeItem(highlightedItem, highlighted, nodeOptions, linkOptions);

    // Add interaction props for tooltips
    const interactionProps = useInteractionItemProps(identifier);

    const handleClick = useEventCallback((event: React.MouseEvent<SVGPathElement>) => {
      onClick?.(event, identifier);
    });

    if (!link.path) {
      return null; // No path defined, nothing to render
    }

    // TODO: improve
    let finalOpacity = opacity;
    let filter: string | undefined;

    if (faded) {
      finalOpacity = opacity * 0.3;
      filter = 'saturate(80%)';
    } else if (highlighted) {
      finalOpacity = Math.min(opacity * 1.2, 1);
      filter = 'saturate(120%)';
    }

    return (
      <path
        ref={ref}
        d={link.path}
        fill={link.color}
        opacity={finalOpacity}
        style={{ filter }}
        data-link-source={link.source.id}
        data-link-target={link.target.id}
        data-highlighted={highlighted || undefined}
        data-faded={faded || undefined}
        onClick={onClick ? handleClick : undefined}
        cursor={onClick ? 'pointer' : 'default'}
        {...interactionProps}
      />
    );
  },
);
