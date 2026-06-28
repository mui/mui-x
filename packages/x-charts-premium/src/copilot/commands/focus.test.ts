import { describe, expect, it } from 'vitest';
import type { ChartCopilotState } from '../chartState';
import type { ChartFocusState } from '../chartFocusState';
import { focusHighlight, focusReset, focusZoom } from './focus';

function makeCtx(values: string[], initialFocus: ChartFocusState = {}) {
  let focus = initialFocus;
  const state = { values: values.map((field) => ({ field })) } as ChartCopilotState;
  return {
    ctx: {
      adapter: {
        api: {
          getChartState: () => state,
          getFocus: () => focus,
          setFocus: (next: ChartFocusState) => {
            focus = next;
          },
        },
      },
    } as any,
    getFocus: () => focus,
  };
}

describe('focus commands', () => {
  it('focus.zoom stores the window and validates from/to', () => {
    const { ctx, getFocus } = makeCtx(['coffee']);
    expect(focusZoom.validate?.({ from: 'Jul', to: 'Sep' } as any, ctx)).to.deep.equal({
      ok: true,
    });
    expect(focusZoom.validate?.({} as any, ctx)).to.deep.equal({
      ok: false,
      reason: 'focus.zoom requires { from, to }',
    });
    focusZoom.run({ from: 'Jul', to: 'Sep' }, ctx);
    expect(getFocus().zoom).to.deep.equal({ from: 'Jul', to: 'Sep' });
  });

  it('focus.highlight validates the series and stores it', () => {
    const { ctx, getFocus } = makeCtx(['coffee', 'tea']);
    expect((focusHighlight.validate?.({ seriesId: 'milk' } as any, ctx) as any).ok).to.equal(false);
    expect(focusHighlight.validate?.({ seriesId: 'coffee' } as any, ctx)).to.deep.equal({
      ok: true,
    });
    focusHighlight.run({ series: ['tea'] }, ctx);
    expect(getFocus().highlight).to.deep.equal({ seriesId: 'tea' });
  });

  it('focus.reset clears zoom and highlight', () => {
    const { ctx, getFocus } = makeCtx(['coffee'], {
      zoom: { from: 1, to: 2 },
      highlight: { seriesId: 'coffee' },
    });
    focusReset.run({}, ctx);
    expect(getFocus()).to.deep.equal({});
  });

  it('focus.zoom preserves an existing highlight', () => {
    const { ctx, getFocus } = makeCtx(['coffee'], { highlight: { seriesId: 'coffee' } });
    focusZoom.run({ from: 0, to: 3 }, ctx);
    expect(getFocus().highlight).to.deep.equal({ seriesId: 'coffee' });
    expect(getFocus().zoom).to.deep.equal({ from: 0, to: 3 });
  });
});
