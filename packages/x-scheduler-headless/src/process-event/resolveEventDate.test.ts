import { adapter } from 'test/utils/scheduler/adapters';
import { resolveEventDate } from '@mui/x-scheduler-headless/process-event';

describe('resolveEventDate', () => {
  it('converts Z-string to an instant', () => {
    const result = resolveEventDate('2025-01-01T10:00:00Z', 'America/New_York', adapter);
    expect(result.getTime()).to.equal(new Date('2025-01-01T10:00:00Z').getTime());
  });

  it('converts non-Z string to wall-time in the given dataTimezone', () => {
    // "2025-01-01T09:00:00" in America/New_York means 09:00 local → 14:00 UTC (EST = UTC-5)
    const result = resolveEventDate('2025-01-01T09:00:00', 'America/New_York', adapter);
    expect(adapter.getHours(result)).to.equal(9);
    expect(adapter.getTimezone(result)).to.equal('America/New_York');
    expect(result.getTime()).to.equal(new Date('2025-01-01T14:00:00Z').getTime());
  });

  it('uses "default" timezone when dataTimezone is "default"', () => {
    const result = resolveEventDate('2025-01-01T09:00:00', 'default', adapter);
    expect(adapter.getHours(result)).to.equal(9);
  });
});
