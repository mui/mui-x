import { vi } from 'vitest';
import { getMarkerInteractionProps } from './ScatterAsyncBatch';

const instance = {
  setLastUpdateSource: () => {},
  setTooltipItem: () => {},
  setHighlight: () => {},
  removeTooltipItem: () => {},
  clearHighlight: () => {},
  focusItem: vi.fn(),
} as any;

const dataPoint = { x: 0, y: 0, dataIndex: 3, seriesId: 'A', type: 'scatter' } as any;

const build = (overrides: Record<string, unknown>) =>
  getMarkerInteractionProps({
    instance,
    dataPoint,
    seriesId: 'A',
    dataIndex: 3,
    onItemClick: undefined,
    skipInteractionHandlers: false,
    isInteracting: false,
    ...overrides,
  } as any);

describe('getMarkerInteractionProps', () => {
  it('returns the pointer handlers and the click by default', () => {
    const props = build({})!;
    expect(props.onClick).not.to.equal(undefined);
    expect(props.onPointerEnter).not.to.equal(undefined);
  });

  it('keeps the click while a zoom interaction is in progress', () => {
    const props = build({ isInteracting: true })!;
    // Pointer handlers are dropped for performance, the click still fires the callback.
    expect(props.onClick).not.to.equal(undefined);
    expect(props.onPointerEnter).to.equal(undefined);
  });

  it('forwards onItemClick with the item identifier', () => {
    const onItemClick = vi.fn();
    build({ onItemClick, isInteracting: true })!.onClick!({} as any);

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'scatter',
      seriesId: 'A',
      dataIndex: 3,
    });
  });

  it('drops every handler when the closest point plugin owns the series', () => {
    expect(build({ skipInteractionHandlers: true })).to.equal(undefined);
  });
});
