import { describe, it, expect } from 'vitest';
import { defaultizeXAxis, defaultizeYAxis } from './defaultizeAxis';

const DEFAULT_STYLE = { fontFamily: 'Roboto', fontSize: 12, letterSpacing: '0.03333em' };

describe('defaultizeAxis - tickLabelStyle', () => {
  it('should apply the default tick label style', () => {
    expect(
      defaultizeXAxis([{ scaleType: 'linear' }], undefined, 0, DEFAULT_STYLE)[0].tickLabelStyle,
    ).to.deep.eq(DEFAULT_STYLE);

    expect(
      defaultizeYAxis([{ scaleType: 'linear' }], undefined, 0, DEFAULT_STYLE)[0].tickLabelStyle,
    ).to.deep.eq(DEFAULT_STYLE);
  });

  it('should let the axis override the default tick label style', () => {
    const axes = defaultizeXAxis(
      [{ scaleType: 'linear', tickLabelStyle: { fontSize: 20 } }],
      undefined,
      0,
      DEFAULT_STYLE,
    );

    expect(axes[0].tickLabelStyle).to.deep.eq({ ...DEFAULT_STYLE, fontSize: 20 });
  });
});
