import { dependenciesStoreFeature } from '@mui/x-scheduler-internals-premium/internals';
import type { EventTimelinePremiumDependenciesFeature } from '../../features/EventTimelinePremiumFeatures.types';
import { EventTimelinePremiumDependencyLayer } from './EventTimelinePremiumDependencyLayer';
import { useDependencyDescription } from './useDependencyDescription';

export const dependenciesFeature: EventTimelinePremiumDependenciesFeature = {
  store: dependenciesStoreFeature,
  Layer: EventTimelinePremiumDependencyLayer,
  useDescription: useDependencyDescription,
};
