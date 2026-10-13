import { describe, it, expect, afterEach } from 'vitest';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { getFocusFallback } from './focus-utils';

describe('getFocusFallback', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountEvent(html: string) {
    document.body.innerHTML = html;
    return document.getElementById('event')!;
  }

  it('should return the cell owning the event inside a grid', () => {
    const event = mountEvent(
      '<div role="grid"><div role="gridcell" id="cell" tabindex="0"><div id="event" tabindex="0"></div></div></div>',
    );

    expect(getFocusFallback(event, 'event-1')).to.equal(document.getElementById('cell'));
  });

  it('should not look past the view for a focusable ancestor of the host page', () => {
    const event = mountEvent(
      '<div role="dialog" tabindex="-1"><div role="grid"><div id="event" tabindex="0"></div></div></div>',
    );

    expect(getFocusFallback(event, 'event-1')).to.equal(null);
  });

  it('should return null for an element outside any scheduler view', () => {
    const event = mountEvent('<div tabindex="0"><div id="event" tabindex="0"></div></div>');

    expect(getFocusFallback(event, 'event-1')).to.equal(null);
  });

  describe('agenda', () => {
    function mountAgenda(rows: { id: string; eventId: string }[]) {
      const items = rows
        .map(
          ({ id, eventId }) =>
            `<li class="${eventCalendarClasses.agendaViewEventListItem}"><div id="${id}" data-event-id="${eventId}" tabindex="0"></div></li>`,
        )
        .join('');
      document.body.innerHTML = `<div class="${eventCalendarClasses.agendaView}">${items}</div>`;
    }

    it('should skip every other row of the deleted event, even one still in the document (e.g. a pending dataSource persist)', () => {
      // A multi-day or recurring event renders one row per day/occurrence; `jul3` and `jul4` are
      // both rows of the event being deleted. Neither is removed here — the exclusion is by
      // `eventId`, not by whether a row has unmounted, so a `dataSource` persist still in flight
      // (which only removes the rows once it resolves) can't fool it into picking `jul4`.
      mountAgenda([
        { id: 'jul3', eventId: 'multi-day' },
        { id: 'jul4', eventId: 'multi-day' },
        { id: 'other', eventId: 'other-event' },
      ]);

      const fallback = getFocusFallback(document.getElementById('jul3')!, 'multi-day');

      expect(fallback).to.equal(document.getElementById('other'));
    });

    it('should fall back to the previous event when the deleted one was last', () => {
      mountAgenda([
        { id: 'first', eventId: 'event-1' },
        { id: 'last', eventId: 'event-2' },
      ]);

      const fallback = getFocusFallback(document.getElementById('last')!, 'event-2');

      expect(fallback).to.equal(document.getElementById('first'));
    });

    it('should return null when no other event survives the delete', () => {
      mountAgenda([{ id: 'only', eventId: 'event-1' }]);

      const fallback = getFocusFallback(document.getElementById('only')!, 'event-1');

      expect(fallback).to.equal(null);
    });
  });
});
