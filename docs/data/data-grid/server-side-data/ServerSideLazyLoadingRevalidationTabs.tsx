import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ServerSideLazyLoadingGroupingRevalidation from './ServerSideLazyLoadingGroupingRevalidation';
import ServerSideLazyLoadingRevalidation from './ServerSideLazyLoadingRevalidation';
import ServerSideLazyLoadingTreeDataRevalidation from './ServerSideLazyLoadingTreeDataRevalidation';

const demos = [
  {
    value: 'plain-data',
    label: 'Plain data',
    component: ServerSideLazyLoadingRevalidation,
  },
  {
    value: 'tree-data',
    label: (
      <span>
        Tree data <span className="plan-pro" title="Pro plan" />
      </span>
    ),
    component: ServerSideLazyLoadingTreeDataRevalidation,
  },
  {
    value: 'row-grouping',
    label: (
      <span>
        Row grouping <span className="plan-premium" title="Premium plan" />
      </span>
    ),
    component: ServerSideLazyLoadingGroupingRevalidation,
  },
] as const;

type DemoValue = (typeof demos)[number]['value'];

export default function ServerSideLazyLoadingRevalidationTabs() {
  const [activeTab, setActiveTab] = React.useState<DemoValue>('plain-data');

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_event, newValue: DemoValue) => setActiveTab(newValue)}
          aria-label="Server-side lazy loading revalidation demos"
          variant="scrollable"
          scrollButtons="auto"
        >
          {demos.map((demo) => (
            <Tab
              key={demo.value}
              value={demo.value}
              id={`server-side-lazy-loading-revalidation-tab-${demo.value}`}
              aria-controls={`server-side-lazy-loading-revalidation-tabpanel-${demo.value}`}
              label={demo.label}
            />
          ))}
        </Tabs>
      </Box>
      {demos.map((demo) => {
        const Demo = demo.component;

        return (
          <div
            key={demo.value}
            role="tabpanel"
            hidden={activeTab !== demo.value}
            id={`server-side-lazy-loading-revalidation-tabpanel-${demo.value}`}
            aria-labelledby={`server-side-lazy-loading-revalidation-tab-${demo.value}`}
          >
            {activeTab === demo.value ? <Demo /> : null}
          </div>
        );
      })}
    </Box>
  );
}
