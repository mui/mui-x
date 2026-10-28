'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { EventTimelinePremiumInternalFeatures } from './EventTimelinePremiumFeatures.types';

export const EventTimelinePremiumFeaturesContext =
  React.createContext<EventTimelinePremiumInternalFeatures>(EMPTY_OBJECT);

export function useEventTimelinePremiumFeatures(): EventTimelinePremiumInternalFeatures {
  return React.useContext(EventTimelinePremiumFeaturesContext);
}
