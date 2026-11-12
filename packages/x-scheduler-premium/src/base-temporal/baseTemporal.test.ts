import { describe, it, expect } from 'vitest';
import { BaseTemporal } from '@mui/x-scheduler/base-temporal';
import { BaseTemporal as PremiumBaseTemporal } from '@mui/x-scheduler-premium/base-temporal';

describe('base-temporal', () => {
  it('should export the API of the community package', () => {
    expect(PremiumBaseTemporal).to.equal(BaseTemporal);
  });
});
