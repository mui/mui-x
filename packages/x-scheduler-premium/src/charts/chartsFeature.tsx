'use client';
import * as React from 'react';
import type { Dataset } from '@mui/x-internals/types';
import type { EventCalendarPremiumChartsFeature } from '../event-calendar-premium/features/EventCalendarPremiumFeatures.types';
import { ChartsPanel } from './ChartsPanel';

export type EventCalendarPremiumChartsRendererCallback = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => React.ReactNode;

/**
 * The `ChartsRenderer` component of `@mui/x-charts-premium`.
 */
export type EventCalendarPremiumChartsRenderer = React.ComponentType<{
  dimensions: Dataset<string | number | Date | null>;
  values: Dataset<number | null>;
  chartType: string;
  configuration: Record<string, any>;
  onRender?: EventCalendarPremiumChartsRendererCallback;
}>;

export interface EventCalendarPremiumChartsFeatureConfig {
  /**
   * The component that renders the charts.
   * Pass the `ChartsRenderer` component from `@mui/x-charts-premium/ChartsRenderer`.
   */
  renderer: EventCalendarPremiumChartsRenderer;
}

/**
 * Creates the charts feature of the Event Calendar.
 * The cards are configured through the `charts` prop of the Event Calendar.
 */
export function createChartsFeature(
  config: EventCalendarPremiumChartsFeatureConfig,
): EventCalendarPremiumChartsFeature {
  const { renderer } = config;
  if (!renderer) {
    throw new Error(
      'MUI X Scheduler: The charts feature was created without a `renderer`. ' +
        'The cards cannot be drawn without it. ' +
        'Pass the `ChartsRenderer` component from `@mui/x-charts-premium/ChartsRenderer` to `createChartsFeature`.',
    );
  }

  return {
    Panel: function ChartsFeaturePanel() {
      return <ChartsPanel renderer={renderer} />;
    },
  };
}
