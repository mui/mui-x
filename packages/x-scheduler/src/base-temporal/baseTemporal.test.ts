import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import { BaseTemporal } from '@mui/x-scheduler/base-temporal';

describe('base-temporal', () => {
  it('should expose the plain date-times of the occurrences', () => {
    const occurrence = EventBuilder.new()
      .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toOccurrence();

    const { start, end } = occurrence;
    expect(start.plainDateTime).to.be.instanceOf(BaseTemporal.PlainDateTime);
    // Read in the display timezone.
    expect(start.plainDateTime.toString()).to.equal('2025-07-01T05:00:00');
    expect(BaseTemporal.PlainDateTime.compare(start.plainDateTime, end.plainDateTime)).to.equal(-1);
    expect(
      start.plainDateTime.toPlainDate().equals(BaseTemporal.PlainDate.from('2025-07-01')),
    ).to.equal(true);
  });
});
