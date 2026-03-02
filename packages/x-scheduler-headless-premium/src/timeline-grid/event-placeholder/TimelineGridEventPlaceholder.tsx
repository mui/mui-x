'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useElementPositionInCollection, useEvent } from '@mui/x-scheduler-headless/internals';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { TimelineGridEventPlaceholderCssVars } from './TimelineGridEventPlaceholderCssVars';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';

export const TimelineGridEventPlaceholder = React.forwardRef(function TimelineGridEventPlaceholder(
  componentProps: TimelineGridEventPlaceholder.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);

  // Feature hooks
  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: viewConfig.start,
    collectionEnd: viewConfig.end,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [TimelineGridEventPlaceholderCssVars.xPosition]: `${position * 100}%`,
        [TimelineGridEventPlaceholderCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const { state } = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineGridEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
