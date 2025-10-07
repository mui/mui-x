import * as React from 'react';
import { X } from 'lucide-react';
import { Popover } from '@base-ui-components/react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useTranslations } from '../../utils/TranslationsContext';
import { MoreEventsPopoverContext, useMoreEventsPopoverContext } from './MoreEventsPopoverContext';
import { MoreEventsPopoverContextValue } from './MoreEventsPopover.types';
import { CalendarEventOccurrence } from '../../../../primitives';
import { ArrowSvg } from './arrow';
import './MoreEventsPopover.css';
import { DayGridEvent } from '../event';
import { AgendaEvent } from '../event/agenda-event/AgendaEvent';

export default function MoreEventsPopover(props) {
  const { anchor, container, occurrences, onClose } = props;

  console.log(occurrences);

  const translations = useTranslations();

  return (
    <Popover.Portal container={container}>
      <Popover.Positioner
        anchor={anchor}
        sideOffset={8}
        className="PopoverPositioner MoreEventsPopoverPositioner"
      >
        <Popover.Popup>
          <Popover.Arrow className="PopoverArrow">
            <ArrowSvg />
          </Popover.Arrow>
          <div className="MoreEventsPopoverHeader">
            <Popover.Title className="MoreEventsPopoverTitle">2 more events</Popover.Title>
            <Popover.Close
              aria-label={translations.closeButtonAriaLabel}
              className="EventPopoverCloseButton NeutralTextButton"
            >
              <X size={16} strokeWidth={1.5} />
            </Popover.Close>
          </div>
          <div className="MoreEventsPopoverContent">
            {occurrences.map((occurrence) => (
              <AgendaEvent key={occurrence.id} occurrence={occurrence} />
            ))}
          </div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export function MoreEventsPopoverProvider(props) {
  const { containerRef, children } = props;
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [occurrences, setOccurrences] = React.useState<CalendarEventOccurrence[] | []>([]);

  const handleClose = useEventCallback(() => {
    if (!isPopoverOpen) {
      return;
    }
    setIsPopoverOpen(false);
    setAnchor(null);
  });

  const showEvents = useEventCallback(
    (anchorElement: HTMLElement, occurrences: CalendarEventOccurrence[]) => {
      setAnchor(anchorElement);
      setOccurrences(occurrences);
      setIsPopoverOpen(true);
    },
  );

  const contextValue = React.useMemo<MoreEventsPopoverContextValue>(
    () => ({ showEvents }),
    [showEvents],
  );

  return (
    <MoreEventsPopoverContext.Provider value={contextValue}>
      <Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
        {children}
        {anchor && occurrences.length > 0 && (
          <MoreEventsPopover
            anchor={anchor}
            occurrences={occurrences}
            container={containerRef.current}
            onClose={handleClose}
          />
        )}
      </Popover.Root>
    </MoreEventsPopoverContext.Provider>
  );
}

export function MoreEventsPopoverTrigger(props: any) {
  const { occurrences, ...other } = props;
  const { showEvents } = useMoreEventsPopoverContext();

  return (
    <Popover.Trigger onClick={(event) => showEvents(event.currentTarget, occurrences)} {...other} />
  );
}
