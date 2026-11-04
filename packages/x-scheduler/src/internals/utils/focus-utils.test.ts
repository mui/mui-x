import { describe, it, expect, afterEach } from 'vitest';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { captureFocusFallback, resolveFocusFallback } from './focus-utils';

describe('captureFocusFallback / resolveFocusFallback', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountEvent(html: string) {
    document.body.innerHTML = html;
    return document.getElementById('event')!;
  }

  function mountAgenda(rows: { id: string; eventId: string; timestamp?: number }[]) {
    const items = rows
      .map(
        ({ id, eventId, timestamp = 0 }) =>
          `<li class="${eventCalendarClasses.agendaViewEventListItem}"><div id="${id}" data-event-id="${eventId}" data-occurrence-timestamp="${timestamp}" tabindex="0"></div></li>`,
      )
      .join('');
    document.body.innerHTML = `<div class="${eventCalendarClasses.agendaView}">${items}</div>`;
  }

  it('should return the cell owning the event inside a grid', () => {
    const event = mountEvent(
      '<div role="grid"><div role="gridcell" id="cell" tabindex="0"><div id="event" tabindex="0"></div></div></div>',
    );

    const snapshot = captureFocusFallback(event, 'event-1', 0)!;

    expect(resolveFocusFallback(snapshot, null)).to.equal(document.getElementById('cell'));
  });

  it('should not look past the view for a focusable ancestor of the host page', () => {
    const event = mountEvent(
      '<div role="dialog" tabindex="-1"><div role="grid"><div id="event" tabindex="0"></div></div></div>',
    );

    const snapshot = captureFocusFallback(event, 'event-1', 0)!;

    expect(resolveFocusFallback(snapshot, null)).to.equal(null);
  });

  it('should return null for an element outside any scheduler view', () => {
    const event = mountEvent('<div tabindex="0"><div id="event" tabindex="0"></div></div>');

    expect(captureFocusFallback(event, 'event-1', 0)).to.equal(null);
  });

  describe('agenda, no recurring scope (every row of the event is going away)', () => {
    it('should skip every other row of the deleted event, even one still in the document (e.g. a pending dataSource persist)', () => {
      // `jul3` and `jul4` are both rows of the deleted event, and neither has unmounted here —
      // the identity exclusion skips both anyway, regardless of connection state.
      mountAgenda([
        { id: 'jul3', eventId: 'multi-day' },
        { id: 'jul4', eventId: 'multi-day' },
        { id: 'other', eventId: 'other-event' },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('jul3')!, 'multi-day', 0)!;

      expect(resolveFocusFallback(snapshot, null)).to.equal(document.getElementById('other'));
    });

    it('should fall back to the previous event when the deleted one was last', () => {
      mountAgenda([
        { id: 'first', eventId: 'event-1' },
        { id: 'last', eventId: 'event-2' },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('last')!, 'event-2', 0)!;

      expect(resolveFocusFallback(snapshot, null)).to.equal(document.getElementById('first'));
    });

    it('should return null when no other event survives the delete', () => {
      mountAgenda([{ id: 'only', eventId: 'event-1' }]);

      const snapshot = captureFocusFallback(document.getElementById('only')!, 'event-1', 0)!;

      expect(resolveFocusFallback(snapshot, null)).to.equal(null);
    });
  });

  describe('agenda, recurring scope', () => {
    // "Only this" just adds an EXDATE: every other occurrence of the series survives.
    it('should only skip the deleted occurrence for "only-this", keeping earlier and later occurrences of the same series', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tue', eventId: 'daily', timestamp: 2 },
        { id: 'wed', eventId: 'daily', timestamp: 3 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tue')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'only-this')).to.equal(document.getElementById('wed'));
    });

    it('should fall back to the previous occurrence for "only-this" when the deleted one is last', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tue', eventId: 'daily', timestamp: 2 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tue')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'only-this')).to.equal(document.getElementById('mon'));
    });

    // "This and following" truncates the rule from the edited occurrence onward: every later
    // occurrence is also gone, but anything before it survives.
    it('should skip the deleted occurrence and every later one for "this-and-following", keeping earlier occurrences', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tue', eventId: 'daily', timestamp: 2 },
        { id: 'wed', eventId: 'daily', timestamp: 3 },
        { id: 'other', eventId: 'other-event', timestamp: 5 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tue')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'this-and-following')).to.equal(
        document.getElementById('other'),
      );
    });

    it('should fall back to an earlier occurrence for "this-and-following" when nothing survives after it', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tue', eventId: 'daily', timestamp: 2 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tue')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'this-and-following')).to.equal(
        document.getElementById('mon'),
      );
    });

    // A multi-day occurrence's own later-day row shares its timestamp, not a greater one — `>=`,
    // not `>`, is required to skip it too.
    it('should also skip a later row that shares the deleted occurrence\'s own start for "this-and-following" (a multi-day occurrence)', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tueDay1', eventId: 'daily', timestamp: 2 },
        { id: 'tueDay2', eventId: 'daily', timestamp: 2 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tueDay1')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'this-and-following')).to.equal(
        document.getElementById('mon'),
      );
    });

    it('should skip every occurrence of the series for "all"', () => {
      mountAgenda([
        { id: 'mon', eventId: 'daily', timestamp: 1 },
        { id: 'tue', eventId: 'daily', timestamp: 2 },
        { id: 'wed', eventId: 'daily', timestamp: 3 },
        { id: 'other', eventId: 'other-event', timestamp: 5 },
      ]);

      const snapshot = captureFocusFallback(document.getElementById('tue')!, 'daily', 2)!;

      expect(resolveFocusFallback(snapshot, 'all')).to.equal(document.getElementById('other'));
    });
  });
});
