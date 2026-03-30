import { isPlanVersionOlderOrEqual } from './licensePlan';

describe('isPlanVersionOlderOrEqual', () => {
  it('should return true for the same version as the threshold', () => {
    expect(isPlanVersionOlderOrEqual('Q1-2026', 'Q1-2026')).to.equal(true);
  });

  it('should return true for versions older than the threshold', () => {
    expect(isPlanVersionOlderOrEqual('initial', 'Q1-2026')).to.equal(true);
    expect(isPlanVersionOlderOrEqual('Q3-2024', 'Q1-2026')).to.equal(true);
    expect(isPlanVersionOlderOrEqual('initial', 'Q3-2024')).to.equal(true);
  });

  it('should return false for versions newer than the threshold', () => {
    expect(isPlanVersionOlderOrEqual('Q1-2026', 'Q3-2024')).to.equal(false);
    expect(isPlanVersionOlderOrEqual('Q3-2024', 'initial')).to.equal(false);
    expect(isPlanVersionOlderOrEqual('Q1-2026', 'initial')).to.equal(false);
  });

  it('should return false for unknown plan versions', () => {
    expect(isPlanVersionOlderOrEqual('unknown', 'Q1-2026')).to.equal(false);
    expect(isPlanVersionOlderOrEqual('Q99-9999', 'Q1-2026')).to.equal(false);
  });
});
