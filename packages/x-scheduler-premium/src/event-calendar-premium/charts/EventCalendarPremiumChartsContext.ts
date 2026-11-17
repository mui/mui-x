'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';

export type EventCalendarPremiumChartsCard = 'byDay' | 'byResource';
export type EventCalendarPremiumChartsMetric = 'hours' | 'count';

export interface EventCalendarPremiumChartsOptions {
  /**
   * The cards to render, in order.
   * @default ['byResource']
   */
  cards?: EventCalendarPremiumChartsCard[];
  /**
   * What the cards measure: number of events, or hours of the events (all-day events have none).
   * @default 'count'
   */
  metric?: EventCalendarPremiumChartsMetric;
}

export const EventCalendarPremiumChartsContext =
  React.createContext<EventCalendarPremiumChartsOptions>(EMPTY_OBJECT);
