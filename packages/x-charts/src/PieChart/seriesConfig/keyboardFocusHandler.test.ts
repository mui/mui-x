import type { FocusedItemIdentifier, PieItemIdentifier } from '@mui/x-charts/models';
import type { VisibilityIdentifierWithType } from '@mui/x-charts/plugins';
import { pieSeriesConfig } from './index';
import keyboardFocusHandler from './keyboardFocusHandler';

const seriesConfig = {
  pie: pieSeriesConfig,
};

const buildState = ({
  series = [
    { id: 'pie-1', data: [{ value: 10 }, { value: 20 }] },
    { id: 'pie-2', data: [{ value: 5 }, { value: 15 }] },
  ],
  hiddenItems = [],
}: {
  series?: Array<{ id: string; data: Array<{ value: number }> }>;
  hiddenItems?: Array<VisibilityIdentifierWithType<'pie'>>;
} = {}) => {
  const seriesObj: Record<string, any> = {};
  const seriesOrder: string[] = [];
  series.forEach((s) => {
    seriesObj[s.id] = { type: 'pie', id: s.id, data: s.data };
    seriesOrder.push(s.id);
  });

  const visibilityMap: Map<string, VisibilityIdentifierWithType<'pie'>> = new Map();
  hiddenItems.forEach((item) => {
    // TODO: Remove  the `as` by allowing Pie Identifiers to omit the dataIndex.
    visibilityMap.set(pieSeriesConfig.identifierSerializer(item as PieItemIdentifier), item);
  });

  return {
    seriesConfig: { config: seriesConfig },
    series: {
      defaultizedSeries: {
        pie: { seriesOrder, series: seriesObj },
      },
      dataset: undefined,
    },
    visibilityManager: {
      visibilityMap,
      isControlled: false,
    },
  };
};

const slice = (seriesId: string, dataIndex: number): FocusedItemIdentifier<'pie'> => ({
  type: 'pie',
  seriesId,
  dataIndex,
});

function press(
  direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown',
  initialFocus: FocusedItemIdentifier<'pie'> | null,
  state: ReturnType<typeof buildState> = buildState(),
) {
  return keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(initialFocus, state as any);
}

describe('<PieChart /> - keyboard navigation', () => {
  it('should move focus between slices', () => {
    const state = buildState();

    expect(press('ArrowRight', slice('pie-1', 0), state)).to.deep.equal(slice('pie-1', 1));
    expect(press('ArrowRight', slice('pie-1', 1), state)).to.deep.equal(slice('pie-1', 2));
    expect(press('ArrowLeft', slice('pie-1', 2), state)).to.deep.equal(slice('pie-1', 1));
    expect(press('ArrowLeft', slice('pie-1', 1), state)).to.deep.equal(slice('pie-1', 0));
  });

  it('should move focus between series', () => {
    const state = buildState();

    expect(press('ArrowDown', slice('pie-1', 0), state)).to.deep.equal(slice('pie-2', 0));
    expect(press('ArrowUp', slice('pie-2', 1), state)).to.deep.equal(slice('pie-1', 1));
  });

  it('should jump from last to first series item with ArrowRight', () => {
    const state = buildState();

    expect(press('ArrowRight', slice('pie-1', 2), state)).to.deep.equal(slice('pie-1', 0));
  });

  it.only('should skip a hidden slice', () => {
    const state = buildState({
      series: [{ id: 'pie-1', data: [{ value: 5 }, { value: 10 }, { value: 20 }] }],
      hiddenItems: [{ type: 'pie', seriesId: 'pie-1', dataIndex: 1 }],
    });

    expect(press('ArrowRight', slice('pie-1', 0), state)).to.deep.equal(slice('pie-1', 2));
    expect(press('ArrowLeft', slice('pie-1', 2), state)).to.deep.equal(slice('pie-1', 0));
  });

  it('should skip a hidden slice even when it is the first one', () => {
    const state = buildState({
      hiddenItems: [{ type: 'pie', seriesId: 'pie-1', dataIndex: 0 }],
      series: [{ id: 'pie-1', data: [{ value: 5 }, { value: 10 }, { value: 20 }] }],
    });

    expect(press('ArrowRight', null, state)).to.deep.equal(slice('pie-1', 1));
    expect(press('ArrowRight', slice('pie-1', 1), state)).to.deep.equal(slice('pie-1', 2));
    expect(press('ArrowRight', slice('pie-1', 2), state)).to.deep.equal(slice('pie-1', 1));
  });

  it('should skip a hidden series', () => {
    const state = buildState({
      series: [
        { id: 'pie-1', data: [{ value: 10 }, { value: 20 }] },
        { id: 'pie-2', data: [{ value: 5 }, { value: 15 }] },
        { id: 'pie-3', data: [{ value: 100 }, { value: 200 }] },
      ],
      hiddenItems: [{ type: 'pie', seriesId: 'pie-2' }],
    });

    expect(press('ArrowDown', slice('pie-1', 0), state)).to.deep.equal(slice('pie-3', 0));
    expect(press('ArrowUp', slice('pie-3', 0), state)).to.deep.equal(slice('pie-1', 0));
  });
});
