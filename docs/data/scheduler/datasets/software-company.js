// Software Company Roadmap - Nested Resources Dataset

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const resources = [
  {
    title: 'Engineering',
    id: 'engineering',
    eventColor: 'blue',
    children: [
      {
        title: 'Frontend',
        id: 'frontend',
        eventColor: 'indigo',
        children: [
          { title: 'Web App', id: 'web-app', eventColor: 'purple' },
          { title: 'Mobile App', id: 'mobile-app', eventColor: 'pink' },
        ],
      },
      {
        title: 'Backend',
        id: 'backend',
        eventColor: 'teal',
        children: [
          { title: 'API Team', id: 'api-team', eventColor: 'green' },
          { title: 'Infrastructure', id: 'infrastructure', eventColor: 'grey' },
        ],
      },
    ],
  },
  {
    title: 'Product',
    id: 'product',
    eventColor: 'orange',
    children: [
      { title: 'Design', id: 'design', eventColor: 'amber' },
      { title: 'Research', id: 'research', eventColor: 'lime' },
    ],
  },
  { title: 'Marketing', id: 'marketing', eventColor: 'red' },
];

export const initialEvents = [
  // =====================
  // WEB APP TEAM
  // =====================
  {
    id: 'web-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-18T00:00:00',
    title: 'Dashboard Redesign',
    resource: 'web-app',
    allDay: true,
  },
  {
    id: 'web-2',
    start: '2025-07-21T00:00:00',
    end: '2025-08-08T00:00:00',
    title: 'Form Builder Feature',
    resource: 'web-app',
    allDay: true,
  },
  {
    id: 'web-3',
    start: '2025-08-11T00:00:00',
    end: '2025-08-22T00:00:00',
    title: 'Accessibility Audit',
    resource: 'web-app',
    allDay: true,
  },
  // =====================
  // MOBILE APP TEAM
  // =====================
  {
    id: 'mobile-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-11T00:00:00',
    title: 'iOS Push Notifications',
    resource: 'mobile-app',
    allDay: true,
  },
  {
    id: 'mobile-2',
    start: '2025-07-14T00:00:00',
    end: '2025-08-01T00:00:00',
    title: 'Android Performance Optimization',
    resource: 'mobile-app',
    allDay: true,
  },
  {
    id: 'mobile-3',
    start: '2025-08-04T00:00:00',
    end: '2025-08-15T00:00:00',
    title: 'Cross-Platform Testing',
    resource: 'mobile-app',
    allDay: true,
  },
  {
    id: 'mobile-4',
    start: '2025-08-18T00:00:00',
    end: '2025-08-29T00:00:00',
    title: 'Offline Mode Implementation',
    resource: 'mobile-app',
    allDay: true,
  },
  // =====================
  // API TEAM
  // =====================
  {
    id: 'api-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-25T00:00:00',
    title: 'REST to GraphQL Migration',
    resource: 'api-team',
    allDay: true,
  },
  {
    id: 'api-2',
    start: '2025-07-28T00:00:00',
    end: '2025-08-08T00:00:00',
    title: 'Rate Limiting Implementation',
    resource: 'api-team',
    allDay: true,
  },
  {
    id: 'api-3',
    start: '2025-08-11T00:00:00',
    end: '2025-08-22T00:00:00',
    title: 'API Documentation Sprint',
    resource: 'api-team',
    allDay: true,
  },
  // =====================
  // INFRASTRUCTURE TEAM
  // =====================
  {
    id: 'infra-1',
    start: '2025-07-07T00:00:00',
    end: '2025-07-18T00:00:00',
    title: 'Kubernetes Cluster Upgrade',
    resource: 'infrastructure',
    allDay: true,
  },
  {
    id: 'infra-2',
    start: '2025-07-21T00:00:00',
    end: '2025-08-01T00:00:00',
    title: 'Monitoring Dashboard Setup',
    resource: 'infrastructure',
    allDay: true,
  },
  {
    id: 'infra-3',
    start: '2025-08-04T00:00:00',
    end: '2025-08-22T00:00:00',
    title: 'Database Migration to Aurora',
    resource: 'infrastructure',
    allDay: true,
  },
  // =====================
  // DESIGN TEAM
  // =====================
  {
    id: 'design-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-18T00:00:00',
    title: 'Design System v2',
    resource: 'design',
    allDay: true,
  },
  {
    id: 'design-2',
    start: '2025-07-21T00:00:00',
    end: '2025-08-01T00:00:00',
    title: 'User Journey Mapping',
    resource: 'design',
    allDay: true,
  },
  {
    id: 'design-3',
    start: '2025-08-04T00:00:00',
    end: '2025-08-15T00:00:00',
    title: 'Mobile App Prototype',
    resource: 'design',
    allDay: true,
  },
  {
    id: 'design-4',
    start: '2025-08-18T00:00:00',
    end: '2025-08-29T00:00:00',
    title: 'Dashboard Usability Testing',
    resource: 'design',
    allDay: true,
  },
  // =====================
  // RESEARCH TEAM
  // =====================
  {
    id: 'research-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-11T00:00:00',
    title: 'Competitor Analysis',
    resource: 'research',
    allDay: true,
  },
  {
    id: 'research-2',
    start: '2025-07-14T00:00:00',
    end: '2025-07-25T00:00:00',
    title: 'User Interview Sessions',
    resource: 'research',
    allDay: true,
  },
  {
    id: 'research-3',
    start: '2025-07-28T00:00:00',
    end: '2025-08-08T00:00:00',
    title: 'Feature Prioritization Framework',
    resource: 'research',
    allDay: true,
  },
  {
    id: 'research-4',
    start: '2025-08-11T00:00:00',
    end: '2025-08-29T00:00:00',
    title: 'Q4 Roadmap Research',
    resource: 'research',
    allDay: true,
  },
  // =====================
  // MARKETING
  // =====================
  {
    id: 'mkt-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-18T00:00:00',
    title: 'Product Launch Campaign',
    resource: 'marketing',
    allDay: true,
  },
  {
    id: 'mkt-2',
    start: '2025-07-21T00:00:00',
    end: '2025-08-01T00:00:00',
    title: 'Developer Blog Series',
    resource: 'marketing',
    allDay: true,
  },
  {
    id: 'mkt-3',
    start: '2025-08-04T00:00:00',
    end: '2025-08-15T00:00:00',
    title: 'Social Media Strategy',
    resource: 'marketing',
    allDay: true,
  },
  {
    id: 'mkt-4',
    start: '2025-08-18T00:00:00',
    end: '2025-08-29T00:00:00',
    title: 'Conference Preparation',
    resource: 'marketing',
    allDay: true,
  },
];
