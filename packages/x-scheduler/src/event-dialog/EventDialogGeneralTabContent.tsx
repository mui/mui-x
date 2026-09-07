'use client';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import { EventDialogDateTimeSection } from './EventDialogDateTimeSection';
import { EventDialogResourceAndColorSection } from './EventDialogResourceAndColorSection';
import { EventDialogDescriptionSection } from './EventDialogDescriptionSection';

/**
 * Default content of the General tab.
 * Sections read the occurrence and their fields from context, so they compose in any order.
 */
export function EventDialogGeneralTabContent() {
  return (
    <React.Fragment>
      <EventDialogDateTimeSection />
      <Divider />
      <EventDialogResourceAndColorSection />
      <Divider />
      <EventDialogDescriptionSection />
    </React.Fragment>
  );
}
