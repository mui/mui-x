import { afterEach, describe, expect, it, vi } from 'vitest';
import { CHAT_DEFAULT_LOCALE_TEXT } from './chatLocaleText';

describe('CHAT_DEFAULT_LOCALE_TEXT', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('messageTimestampLabel', () => {
    it('formats the time of day as `toLocaleTimeString` does', () => {
      const dateTime = '2026-03-15T09:58:00.000Z';

      expect(CHAT_DEFAULT_LOCALE_TEXT.messageTimestampLabel(dateTime)).toBe(
        new Date(dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      );
    });

    it('returns an invalid date as it was given', () => {
      expect(CHAT_DEFAULT_LOCALE_TEXT.messageTimestampLabel('not a date')).toBe('not a date');
    });
  });

  describe('conversationTimestampLabel', () => {
    it('formats a timestamp from today as the time of day', () => {
      vi.useFakeTimers({ now: new Date(2026, 2, 15, 18, 0) });
      const dateTime = new Date(2026, 2, 15, 9, 58).toISOString();

      expect(CHAT_DEFAULT_LOCALE_TEXT.conversationTimestampLabel(dateTime)).toBe(
        new Date(dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      );
    });

    it('formats a timestamp from another day as the month and day', () => {
      vi.useFakeTimers({ now: new Date(2026, 2, 15, 18, 0) });
      const dateTime = new Date(2026, 2, 12, 9, 58).toISOString();

      expect(CHAT_DEFAULT_LOCALE_TEXT.conversationTimestampLabel(dateTime)).toBe(
        new Date(dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      );
    });

    it('returns an invalid date as it was given', () => {
      expect(CHAT_DEFAULT_LOCALE_TEXT.conversationTimestampLabel('not a date')).toBe('not a date');
    });
  });
});
