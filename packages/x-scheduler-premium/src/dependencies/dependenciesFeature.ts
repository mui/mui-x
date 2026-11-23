'use client';
import { dependenciesStoreFeature } from '@mui/x-scheduler-internals-premium/internals';
import type { EventTimelinePremiumDependenciesFeature } from '../event-timeline-premium/features/EventTimelinePremiumFeatures.types';
import { EventTimelinePremiumDependencyLayer } from '../event-timeline-premium/content/timeline-dependencies/EventTimelinePremiumDependencyLayer';
import { useDependencyDescription } from '../event-timeline-premium/content/timeline-dependencies/useDependencyDescription';

/**
 * Adds dependencies between events to the Event Timeline: the arrows, their editing, and the
 * auto-scheduling of the successors.
 * Pass it to the `features` prop of `<EventTimelinePremium />`.
 */
export const dependenciesFeature: EventTimelinePremiumDependenciesFeature = {
  store: dependenciesStoreFeature,
  Layer: EventTimelinePremiumDependencyLayer,
  useDescription: useDependencyDescription,
};
