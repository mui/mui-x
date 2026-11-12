import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import { BaseTemporal } from '@mui/x-scheduler/base-temporal';

describe('base-temporal', () => {
  it('should expose the zoned date-times of the occurrences', () => {
    const occurrence = EventBuilder.new()
      .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toOccurrence();

    const { start } = occurrence;
    expect(start.value).to.be.instanceOf(BaseTemporal.ZonedDateTime);
    expect(start.value.toString()).to.equal('2025-07-01T05:00:00-04:00[America/New_York]');
    expect(
      BaseTemporal.ZonedDateTime.compare(start.value, start.value.withTimeZone('UTC')),
    ).to.equal(0);
    expect(start.value.toPlainDate().equals(BaseTemporal.PlainDate.from('2025-07-01'))).to.equal(
      true,
    );
  });
});
