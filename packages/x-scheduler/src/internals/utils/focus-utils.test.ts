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

    expect(getFocusFallback(event)()).to.equal(document.getElementById('cell'));
  });

  it('should not look past the view for a focusable ancestor of the host page', () => {
    const event = mountEvent(
      '<div role="dialog" tabindex="-1"><div role="grid"><div id="event" tabindex="0"></div></div></div>',
    );

    expect(getFocusFallback(event)()).to.equal(null);
  });

  it('should return null for an element outside any scheduler view', () => {
    const event = mountEvent('<div tabindex="0"><div id="event" tabindex="0"></div></div>');

    expect(getFocusFallback(event)()).to.equal(null);
  });

  describe('agenda', () => {
    function mountAgenda(eventIds: string[], deletedId: string) {
      const items = eventIds
        .map(
          (id) =>
            `<li class="${eventCalendarClasses.agendaViewEventListItem}"><div id="${id}" tabindex="0"></div></li>`,
        )
        .join('');
      document.body.innerHTML = `<div class="${eventCalendarClasses.agendaView}">${items}</div>`;
      return document.getElementById(deletedId)!;
    }

    it('should skip a sibling row of the same deleted event, resolved after it unmounts too', () => {
      // A multi-day or recurring event renders one row per day/occurrence; `jul3` and `jul4` are
      // both rows of the event being deleted.
      const jul3 = mountAgenda(['jul3', 'jul4', 'other'], 'jul3');
      const resolve = getFocusFallback(jul3);

      // Resolving now (before the delete applies) would wrongly return `jul4`: both are removed
      // in the same commit once the delete actually happens.
      document.getElementById('jul3')!.remove();
      document.getElementById('jul4')!.remove();

      expect(resolve()).to.equal(document.getElementById('other'));
    });

    it('should fall back to the previous event when the deleted one was last', () => {
      const event = mountAgenda(['first', 'last'], 'last');
      const resolve = getFocusFallback(event);

      document.getElementById('last')!.remove();

      expect(resolve()).to.equal(document.getElementById('first'));
    });

    it('should return null when no other event survives the delete', () => {
      const event = mountAgenda(['only'], 'only');
      const resolve = getFocusFallback(event);

      document.getElementById('only')!.remove();

      expect(resolve()).to.equal(null);
    });
  });
});
