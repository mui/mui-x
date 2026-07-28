import { getVisibleFractionRange } from './getVisibleFractionRange';

describe('getVisibleFractionRange', () => {
  it('should offset the rendered columns by the title column when converting to fractions', () => {
    // Columns 5–13 render ticks 4–12 out of 24.
    expect(getVisibleFractionRange({ firstColumnIndex: 5, lastColumnIndex: 13 }, 24)).to.deep.equal(
      { start: 4 / 24, end: 12 / 24 },
    );
  });

  it('should clamp the range start when the title column is the first rendered column', () => {
    expect(getVisibleFractionRange({ firstColumnIndex: 0, lastColumnIndex: 9 }, 24)).to.deep.equal({
      start: 0,
      end: 8 / 24,
    });
  });
});
