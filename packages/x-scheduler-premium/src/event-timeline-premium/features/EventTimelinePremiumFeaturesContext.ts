'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { EventTimelinePremiumFeatures } from './EventTimelinePremiumFeatures.types';

export const EventTimelinePremiumFeaturesContext =
  React.createContext<EventTimelinePremiumFeatures>(EMPTY_OBJECT);

export function useEventTimelinePremiumFeatures(): EventTimelinePremiumFeatures {
  return React.useContext(EventTimelinePremiumFeaturesContext);
}
