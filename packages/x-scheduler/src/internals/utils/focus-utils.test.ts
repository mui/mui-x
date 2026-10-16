import { describe, it, expect, afterEach } from 'vitest';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import {
  getFocusFallback,
  captureAgendaFallbackCandidates,
  resolveAgendaFallback,
} from './focus-utils';

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

describe('captureAgendaFallbackCandidates / resolveAgendaFallback', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountAgenda(rows: { id: string; eventId: string; timestamp: number }[]) {
    const items = rows
      .map(
        ({ id, eventId, timestamp }) =>
          `<li class="${eventCalendarClasses.agendaViewEventListItem}"><div id="${id}" data-event-id="${eventId}" data-occurrence-timestamp="${timestamp}" tabindex="0"></div></li>`,
      )
      .join('');
    document.body.innerHTML = `<div class="${eventCalendarClasses.agendaView}">${items}</div>`;
  }

  it('should return null when the clicked row is in a grid, not the agenda', () => {
    document.body.innerHTML =
      '<div role="grid"><div role="gridcell" tabindex="0"><div id="event" tabindex="0"></div></div></div>';

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('event')!, 'e1', 100);

    expect(snapshot).to.equal(null);
  });

  it('should return null for an element outside any scheduler view', () => {
    document.body.innerHTML = '<div tabindex="0"><div id="event" tabindex="0"></div></div>';

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('event')!, 'e1', 100);

    expect(snapshot).to.equal(null);
  });

  // "Only this" only excludes an EXDATE: a daily series keeps every other occurrence, so the
  // other rows of the same `eventId` must stay eligible fallbacks instead of being skipped
  // wholesale like a non-recurring (or "all"-scope) delete would.
  it('should only skip the deleted occurrence for "only-this", keeping earlier and later occurrences of the same series', () => {
    mountAgenda([
      { id: 'mon', eventId: 'daily', timestamp: 1 },
      { id: 'tue', eventId: 'daily', timestamp: 2 },
      { id: 'wed', eventId: 'daily', timestamp: 3 },
    ]);

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('tue')!, 'daily', 2)!;

    expect(resolveAgendaFallback(snapshot, 'only-this')).to.equal(document.getElementById('wed'));
  });

  it('should fall back to the previous occurrence for "only-this" when the deleted one is last', () => {
    mountAgenda([
      { id: 'mon', eventId: 'daily', timestamp: 1 },
      { id: 'tue', eventId: 'daily', timestamp: 2 },
    ]);

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('tue')!, 'daily', 2)!;

    expect(resolveAgendaFallback(snapshot, 'only-this')).to.equal(document.getElementById('mon'));
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

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('tue')!, 'daily', 2)!;

    expect(resolveAgendaFallback(snapshot, 'this-and-following')).to.equal(
      document.getElementById('other'),
    );
  });

  it('should fall back to an earlier occurrence for "this-and-following" when nothing survives after it', () => {
    mountAgenda([
      { id: 'mon', eventId: 'daily', timestamp: 1 },
      { id: 'tue', eventId: 'daily', timestamp: 2 },
    ]);

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('tue')!, 'daily', 2)!;

    expect(resolveAgendaFallback(snapshot, 'this-and-following')).to.equal(
      document.getElementById('mon'),
    );
  });

  // `null` ("all", or a non-recurring delete) still skips every row of the event, matching
  // `getFocusFallback`'s own behavior for the same scenario.
  it('should skip every occurrence of the series for "all" (and for no scope at all)', () => {
    mountAgenda([
      { id: 'mon', eventId: 'daily', timestamp: 1 },
      { id: 'tue', eventId: 'daily', timestamp: 2 },
      { id: 'wed', eventId: 'daily', timestamp: 3 },
      { id: 'other', eventId: 'other-event', timestamp: 5 },
    ]);

    const snapshot = captureAgendaFallbackCandidates(document.getElementById('tue')!, 'daily', 2)!;

    expect(resolveAgendaFallback(snapshot, 'all')).to.equal(document.getElementById('other'));
    expect(resolveAgendaFallback(snapshot, null)).to.equal(document.getElementById('other'));
  });
});
