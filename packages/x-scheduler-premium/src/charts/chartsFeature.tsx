'use client';
import * as React from 'react';
import type { EventCalendarPremiumChartsFeature } from '../event-calendar-premium/features/EventCalendarPremiumFeatures.types';
import { ChartsPanel } from './ChartsPanel';

export type ChartsCardId = 'hoursPerDay' | 'shareByResource';
export type ChartsMetric = 'hours' | 'count';

export interface ChartsFeatureConfig {
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
 * Creates the charts feature with a custom set of cards.
 */
export function createChartsFeature(
  config: ChartsFeatureConfig = {},
): EventCalendarPremiumChartsFeature {
  const cards = config.cards ?? DEFAULT_CARDS;
  const metric = config.metric ?? 'hours';
  return {
    Panel: function ConfiguredChartsPanel() {
      return <ChartsPanel cards={cards} metric={metric} />;
    },
  };
}

/**
 * The charts feature with the default cards.
 */
export const chartsFeature = createChartsFeature();
