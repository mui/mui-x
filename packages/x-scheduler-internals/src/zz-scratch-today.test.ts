import { adapter } from 'test/utils/scheduler';
import { describe, it } from 'vitest';
import { createStartOfPlainDate, toPlainDateTime } from './internals/utils/plain-date-utils';

const systems = ['UTC', 'America/New_York', 'America/Santiago', 'Pacific/Apia', 'Europe/Paris', 'Asia/Tokyo', 'America/Havana', 'America/Sao_Paulo', 'Australia/Lord_Howe', 'Asia/Beirut', 'America/Asuncion'];
const tzs = ['UTC', 'America/New_York', 'America/Santiago', 'Pacific/Apia', 'Europe/Paris', 'Asia/Tokyo', 'America/Havana', 'America/Sao_Paulo', 'Australia/Lord_Howe', 'Asia/Beirut', 'default'];
const ranges: [string, number][] = [
  ['2011-12-25T00:00:00Z', 12],
  ['2024-09-01T00:00:00Z', 15],
  ['2026-03-01T00:00:00Z', 40],
  ['2018-11-01T00:00:00Z', 10],
  ['2026-10-20T00:00:00Z', 16],
];

describe('scratch', () => {
  it('compares', () => {
    const prev = process.env.TZ;
    const out = new Map<string, number>();
    const examples: string[] = [];
    for (const sys of systems) {
      process.env.TZ = sys;
      for (const [startIso, days] of ranges) {
        const startMs = Date.parse(startIso);
        for (let ms = startMs; ms < startMs + days * 86400000; ms += 3600000) {
          for (const tz of tzs) {
            const now = adapter.setTimezone(adapter.date(new Date(ms).toISOString(), 'default'), tz);
            const master = adapter.getTime(adapter.startOfDay(now));
            const branch = adapter.getTime(createStartOfPlainDate(adapter, toPlainDateTime(ms, tz).date, tz));
            if (master !== branch) {
              const k = `${sys} / ${tz}`;
              out.set(k, (out.get(k) ?? 0) + 1);
              if (examples.length < 40) {
                examples.push(`${sys} ${tz} ${new Date(ms).toISOString()}: master=${new Date(master).toISOString()} branch=${new Date(branch).toISOString()}`);
              }
            }
          }
        }
      }
    }
    process.env.TZ = prev;
    // eslint-disable-next-line no-console
    console.log([...out.entries()].map(([k, v]) => `${k}: ${v}`).join('\n') || 'ALL SAME', '\n', examples.join('\n'));
  });
});
