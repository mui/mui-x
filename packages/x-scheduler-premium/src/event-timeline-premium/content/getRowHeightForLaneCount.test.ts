import { createTheme } from '@mui/material/styles';
import {
  getEventsCellLaneMinHeight,
  getRowHeightForLaneCount,
} from './EventTimelinePremiumContent';

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

  it('getRowHeightForLaneCount treats 0 and negative lane counts as one lane', () => {
    const oneLane = getRowHeightForLaneCount(theme, 1);
    expect(getRowHeightForLaneCount(theme, 0)).to.equal(oneLane);
    expect(getRowHeightForLaneCount(theme, -5)).to.equal(oneLane);
  });
});
