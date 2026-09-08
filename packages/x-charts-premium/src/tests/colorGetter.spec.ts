import type { Assert } from 'test/utils/slotDataAttributes';
import type { ColorGetter, DefaultColorGetter } from '@mui/x-charts/internals';

// Lives in premium so every `ChartsSeriesConfig` augmentation (community, pro, premium) is loaded.

/** Exact type equality. A bare `extends` would pass on a merely-assignable signature. */
type IsExact<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

// Series declaring `colorGetter` in their config entry get that signature.
type AssertPie = Assert<IsExact<ColorGetter<'pie'>, (dataIndex: number) => string>>;
type AssertFunnel = Assert<IsExact<ColorGetter<'funnel'>, (dataIndex: number) => string>>;
type AssertHeatmap = Assert<IsExact<ColorGetter<'heatmap'>, (value: number | null) => string>>;
type AssertMapShape = Assert<IsExact<ColorGetter<'mapShape'>, (name?: string) => string | null>>;

// Series that declare none fall back to the default.
type AssertBar = Assert<IsExact<ColorGetter<'bar'>, DefaultColorGetter>>;
type AssertLine = Assert<IsExact<ColorGetter<'line'>, DefaultColorGetter>>;

// The conditional distributes over unions rather than collapsing to the default.
type AssertUnion = Assert<
  IsExact<ColorGetter<'bar' | 'pie'>, DefaultColorGetter | ((dataIndex: number) => string)>
>;
