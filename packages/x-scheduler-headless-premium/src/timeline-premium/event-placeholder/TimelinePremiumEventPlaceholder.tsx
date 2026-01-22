'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useElementPositionInCollection, useEvent } from '@mui/x-scheduler-headless/internals';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useTimelinePremiumStoreContext } from '../../use-timeline-premium-store-context';
import { TimelinePremiumEventPlaceholderCssVars } from './TimelinePremiumEventPlaceholderCssVars';
import { timelinePremiumViewSelectors } from '../../timeline-premium-selectors';

export const TimelinePremiumEventPlaceholder = React.forwardRef(
  function TimelinePremiumEventPlaceholder(
    componentProps: TimelinePremiumEventPlaceholder.Props,
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
    const store = useTimelinePremiumStoreContext();

    // Selector hooks
    const viewConfig = useStore(store, timelinePremiumViewSelectors.config);

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
          [TimelinePremiumEventPlaceholderCssVars.xPosition]: `${position * 100}%`,
          [TimelinePremiumEventPlaceholderCssVars.width]: `${duration * 100}%`,
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
  },
);

export namespace TimelinePremiumEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
