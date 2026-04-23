'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useElementPositionInCollection, useEvent } from '@mui/x-scheduler-headless/internals';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { TimelineGridEventPlaceholderCssVars } from './TimelineGridEventPlaceholderCssVars';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridEventPlaceholderDataAttributes } from './TimelineGridEventPlaceholderDataAttributes';

const overflowStateAttributesMapping = {
  startingBeforeEdge: (value: boolean) =>
    value ? { [TimelineGridEventPlaceholderDataAttributes.startingBeforeEdge]: '' } : null,
  endingAfterEdge: (value: boolean) =>
    value ? { [TimelineGridEventPlaceholderDataAttributes.endingAfterEdge]: '' } : null,
};

export const TimelineGridEventPlaceholder = React.forwardRef(function TimelineGridEventPlaceholder(
  componentProps: TimelineGridEventPlaceholder.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Feature hooks
  const { position, duration, startingBeforeEdge, endingAfterEdge } =
    useElementPositionInCollection({
      start,
      end,
      collectionStart: presetConfig.start,
      collectionEnd: presetConfig.end,
    });

  const { state: eventState } = useEvent({ start, end });

  const state = { ...eventState, startingBeforeEdge, endingAfterEdge };

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [
      elementProps,
      {
        style: {
          [TimelineGridEventPlaceholderCssVars.xPosition]: `${position * 100}%`,
          [TimelineGridEventPlaceholderCssVars.width]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
    ],
    stateAttributesMapping: overflowStateAttributesMapping,
  });
});

export namespace TimelineGridEventPlaceholder {
  export interface State extends useEvent.State {
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
