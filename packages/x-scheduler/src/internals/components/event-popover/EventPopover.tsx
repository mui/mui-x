'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { Popover } from '@base-ui/react/popover';
import { styled } from '@mui/material/styles';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  EventPopoverProps,
  EventPopoverProviderProps,
  EventPopoverTriggerProps,
} from './EventPopover.types';
import { getDataPaletteProps } from '../../utils/color-utils';
import ReadonlyContent from './ReadonlyContent';
import { FormContent } from './FormContent';
import { schedulerPaletteStyles } from '../../utils/tokens';
import { createPopover } from '../create-popover';

const EventPopoverPositioner = styled(Popover.Positioner, {
  name: 'MuiEventPopover',
  slot: 'Positioner',
})(({ theme }) => ({
  width: '100%',
  maxWidth: 460,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  zIndex: theme.zIndex.modal,
  boxShadow: theme.shadows[4],
  overflow: 'hidden',
  ...schedulerPaletteStyles,
}));

const EventPopover = createPopover<SchedulerRenderableEventOccurrence>({
  contextName: 'EventPopoverContext',
});

export const EventPopoverContext = EventPopover.Context;
export const useEventPopoverContext = EventPopover.useContext;

export const EventPopoverContent = React.forwardRef(function EventPopoverContent(
  props: EventPopoverProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { style, container, anchor, occurrence, onClose, ...other } = props;
  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);
  const isEventReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  return (
    <div ref={forwardedRef} {...other}>
      <Popover.Portal container={container}>
        <EventPopoverPositioner
          sideOffset={8}
          anchor={anchor}
          disableAnchorTracking
          {...getDataPaletteProps(color)}
        >
          <Popover.Popup finalFocus={{ current: anchor }}>
            {isEventReadOnly ? (
              <ReadonlyContent occurrence={occurrence} onClose={onClose} />
            ) : (
              <FormContent occurrence={occurrence} onClose={onClose} />
            )}
          </Popover.Popup>
        </EventPopoverPositioner>
      </Popover.Portal>
    </div>
  );
});

export function EventPopoverProvider(props: EventPopoverProviderProps) {
  const { containerRef, children } = props;
  const store = useSchedulerStoreContext();
  const isScopeDialogOpen = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);

  return (
    <EventPopover.Provider
      containerRef={containerRef}
      renderPopover={({ anchor, data: occurrence, container, onClose }) => (
        <EventPopoverContent
          anchor={anchor}
          occurrence={occurrence}
          container={container}
          onClose={onClose}
        />
      )}
      onClose={() => {
        store.setOccurrencePlaceholder(null);
      }}
      shouldBlockClose={isScopeDialogOpen}
    >
      {children}
    </EventPopover.Provider>
  );
}

export function EventPopoverTrigger(props: EventPopoverTriggerProps) {
  const { occurrence, ...other } = props;

  return <EventPopover.Trigger data={occurrence} nativeButton={false} {...other} />;
}
