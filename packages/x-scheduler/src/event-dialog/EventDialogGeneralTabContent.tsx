'use client';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import { DateTimeSection } from './DateTimeSection';
import { ResourceAndColorSection } from './ResourceAndColorSection';
import { DescriptionSection } from './DescriptionSection';

/**
 * Default content of the General tab.
 * Sections read the occurrence and their fields from context, so they compose in any order.
 */
export function EventDialogGeneralTabContent() {
  return (
    <React.Fragment>
      <DateTimeSection />
      <Divider />
      <ResourceAndColorSection />
      <Divider />
      <DescriptionSection />
    </React.Fragment>
  );
}
