'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import type { Dataset } from '@mui/x-internals/types';
import type { EventCalendarPremiumChartsFeature } from '../event-calendar-premium/features/EventCalendarPremiumFeatures.types';
import { ChartsPanel } from './ChartsPanel';

export type ChartsCardId = 'hoursPerDay' | 'shareByResource';
export type ChartsMetric = 'hours' | 'count';

export type ChartsRendererCallback = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => React.ReactNode;

/**
 * The shape of the `ChartsRenderer` component of `@mui/x-charts-premium`,
 * the same one the Data Grid receives through `<GridChartsRendererProxy />`.
 */
export type ChartsRendererComponent = React.ComponentType<{
  dimensions: Dataset<string | number | Date | null>;
  values: Dataset<number | null>;
  chartType: string;
  configuration: Record<string, any>;
  onRender?: ChartsRendererCallback;
}>;

export interface ChartsFeatureConfig {
  /**
   * The component that renders the charts.
   * Pass the `ChartsRenderer` component from `@mui/x-charts-premium/ChartsRenderer`.
   */
  renderer: ChartsRendererComponent;
  /**
   * The cards to render, in order.
   * @default ['hoursPerDay', 'shareByResource']
   */
  cards?: ChartsCardId[];
  /**
   * What the cards measure: hours of the events, or number of events.
   * All-day events have no hours, so use `count` for datasets made of all-day events.
   * @default 'hours'
   */
  metric?: ChartsMetric;
}

const DEFAULT_CARDS: ChartsCardId[] = ['hoursPerDay', 'shareByResource'];

/**
 * Creates the charts feature of the Event Calendar.
 */
export function createChartsFeature(
  config: ChartsFeatureConfig,
): EventCalendarPremiumChartsFeature {
  const { renderer, cards = DEFAULT_CARDS, metric = 'hours' } = config;

  if (process.env.NODE_ENV !== 'production' && !renderer) {
    warnOnce(
      'MUI X Scheduler: The charts feature needs a `renderer` to draw the cards. ' +
        'Pass the `ChartsRenderer` component from `@mui/x-charts-premium/ChartsRenderer` to `createChartsFeature`.',
    );
  }

  return {
    Panel: function ConfiguredChartsPanel() {
      if (!renderer) {
        return null;
      }
      return <ChartsPanel renderer={renderer} cards={cards} metric={metric} />;
    },
  };
}
