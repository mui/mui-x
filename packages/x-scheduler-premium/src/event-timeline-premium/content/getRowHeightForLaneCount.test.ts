import { createTheme } from '@mui/material/styles';
import { describe, it, expect } from 'vitest';
import { getEventsCellLaneMinHeight, getRowHeightForLaneCount } from './rowGeometry';

// These helpers mirror the EventsCell CSS in JS so the virtualizer can reserve the
// correct vertical space per row. The two paths must agree to the pixel — if either
// side drifts (a theme/spacing change in JS without a matching CSS update, or vice
// versa) rows will overlap or leave gaps under the virtualized viewport. The snapshot
// pins the absolute pixel values for the default MUI theme; if it fails, verify that
// the CSS in `EventTimelinePremiumEventsCell` produces the same height before
// updating the expected number here.
describe('row-height invariant', () => {
  const theme = createTheme();

  // body2: fontSize 0.875rem (× 16 = 14px), lineHeight 1.43
  // spacing(1.125) = 9px
  // 1.43 * 14 + 9 = 29.02
  it('getEventsCellLaneMinHeight matches the EventsCell minmax track size', () => {
    expect(getEventsCellLaneMinHeight(theme)).to.be.closeTo(29.02, 1e-6);
  });

  // Row = 2 × padding(spacing(2)=16) + N × laneMin + (N-1) × gap(spacing(0.5)=4) + 1px border.
  it('getRowHeightForLaneCount matches the rendered EventsCell height for lane counts 1..3', () => {
    expect(getRowHeightForLaneCount(theme, 1)).to.be.closeTo(62.02, 1e-6);
    expect(getRowHeightForLaneCount(theme, 2)).to.be.closeTo(95.04, 1e-6);
    expect(getRowHeightForLaneCount(theme, 3)).to.be.closeTo(128.06, 1e-6);
  });

  // A 20px font, different from the 14px fallback: 1.43 * 20 + 9 = 37.6.
  it('should read a body2 font size given in px or as a number of px', () => {
    for (const fontSize of ['20px', 20]) {
      expect(
        getEventsCellLaneMinHeight(createTheme({ typography: { body2: { fontSize } } })),
      ).to.be.closeTo(37.6, 1e-6);
    }
  });

  it('should convert other body2 font size lengths with the html font size', () => {
    for (const fontSize of ['1.25rem', '1.25em', ' 1.25REM ']) {
      expect(
        getEventsCellLaneMinHeight(createTheme({ typography: { body2: { fontSize } } })),
      ).to.be.closeTo(37.6, 1e-6);
    }
  });

  it('getRowHeightForLaneCount treats 0 and negative lane counts as one lane', () => {
    const oneLane = getRowHeightForLaneCount(theme, 1);
    expect(getRowHeightForLaneCount(theme, 0)).to.equal(oneLane);
    expect(getRowHeightForLaneCount(theme, -5)).to.equal(oneLane);
  });
});
