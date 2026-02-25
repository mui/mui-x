import { adjustRowParams } from './utils';

describe('adjustRowParams', () => {
  it('should return params unchanged when start is a string (cursor-based pagination)', () => {
    const params = { start: 'cursor-abc', end: 50, sortModel: [], filterModel: { items: [] } };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: 100 });
    expect(result).to.equal(params);
  });

  it('should align start and end to page boundaries', () => {
    const params = { start: 7, end: 33 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: 100 });
    expect(result.start).to.equal(0);
    expect(result.end).to.equal(39);
  });

  it('should cap end at rowCount - 1 when page-aligned end exceeds rowCount', () => {
    const params = { start: 7, end: 33 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: 35 });
    expect(result.start).to.equal(0);
    expect(result.end).to.equal(34);
  });

  it('should not cap end when rowCount is undefined (infinite loading)', () => {
    const params = { start: 7, end: 33 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: undefined });
    expect(result.start).to.equal(0);
    expect(result.end).to.equal(39);
  });

  it('should not cap end when rowCount is -1 (infinite loading)', () => {
    const params = { start: 7, end: 33 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: -1 });
    expect(result.start).to.equal(0);
    expect(result.end).to.equal(39);
  });

  it('should handle rowCount of 0', () => {
    const params = { start: 0, end: 10 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: 0 });
    expect(result.start).to.equal(0);
    expect(result.end).to.equal(0);
  });

  // Regression test for https://github.com/mui/mui-x/issues/21104
  it('should correctly handle last page with single row when rowCount % pageSize === 1', () => {
    // rowCount = 31 = pageSize(10) * 3 + 1, meaning the last page has only 1 row (index 30)
    const params = { start: 30, end: 30 };
    const result = adjustRowParams(params, { pageSize: 10, rowCount: 31 });
    expect(result.start).to.equal(30);
    expect(result.end).to.equal(30);
  });
});
