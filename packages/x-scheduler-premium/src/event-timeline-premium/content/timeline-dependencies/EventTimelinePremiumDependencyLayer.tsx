'use client';
import * as React from 'react';
import { EventTimelinePremiumDependencyArrows } from './EventTimelinePremiumDependencyArrows';
import { EventTimelinePremiumDependencyGeometryProvider } from './EventTimelinePremiumDependencyGeometry';
import { EventTimelinePremiumDependencyInteractions } from './EventTimelinePremiumDependencyInteractions';
import { EventTimelinePremiumDependencyTerminals } from './EventTimelinePremiumDependencyTerminals';
import { EventTimelinePremiumDependencyDialog } from './dependency-dialog/EventTimelinePremiumDependencyDialog';

/**
 * Renders the dependency arrows, dialog, interactions and terminals around the rows.
 */
export function EventTimelinePremiumDependencyLayer({ children }: { children: React.ReactNode }) {
  return (
    <EventTimelinePremiumDependencyGeometryProvider>
      <EventTimelinePremiumDependencyArrows />
      {children}
      <EventTimelinePremiumDependencyDialog />
      <EventTimelinePremiumDependencyInteractions />
      {/* Last so the revealed terminals win their z-index ties and
          paint above the arrows and their click hit-areas. */}
      <EventTimelinePremiumDependencyTerminals />
    </EventTimelinePremiumDependencyGeometryProvider>
  );
}
