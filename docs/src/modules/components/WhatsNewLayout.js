import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

const entries = [
  {
    title: 'MUI X v9',
    description:
      'A new major with accessibility-first charts, Data Grid AI assistant, candlestick and range bar charts, and new Scheduler and Chat packages.',
    date: new Date(2026, 3, 8),
    url: 'https://mui.com/blog/introducing-mui-v9/',
    highlightList: [
      {
        title: 'Data Grid – Charts integration [Premium]',
        url: '/x/react-data-grid/charts-integration/',
      },
      {
        title: 'Data Grid – AI Assistant [Premium]',
        url: '/x/react-data-grid/ai-assistant/',
      },
      {
        title: 'Data Grid – Undo and redo [Premium]',
        url: '/x/react-data-grid/undo-redo/',
      },
      {
        title: 'Data Grid – Drag fill [Premium]',
        url: '/x/react-data-grid/clipboard/#drag-to-fill',
      },
      {
        title: 'Data Grid – longText column type',
        url: '/x/react-data-grid/column-definition/#column-types',
      },
      {
        title: 'Charts – Interaction and accessibility',
        url: '/x/react-charts/accessibility/',
      },
      {
        title: 'Charts – Candlestick [Premium]',
        url: '/x/react-charts/candlestick/',
      },
      {
        title: 'Charts – Range bar charts [Premium]',
        url: '/x/react-charts/range-bar/',
      },
      {
        title: 'Charts – WebGL Heatmap renderer [Premium]',
        url: '/x/react-charts/heatmap/#webgl-renderer',
      },
      {
        title: 'Tree View – Virtualization [Pro]',
        url: '/x/react-tree-view/rich-tree-view/virtualization/',
      },
      {
        title: 'Scheduler [Alpha]',
        url: '/x/react-scheduler/',
      },
    ],
  },
  {
    title: 'MUI X v8.2',
    description: 'A roundup of all new features beyond v8.0.0.',
    date: new Date(2025, 12, 1),
    url: 'https://github.com/mui/mui-x/releases/tag/v8.23.0',
    highlightList: [
      {
        title: 'Data Grid – Server-side pivoting [Premium]',
        url: '/x/react-data-grid/pivoting/',
      },
      {
        title: 'Data Grid –Row grouping that adapts as you explore [Premium]',
        url: '/x/react-data-grid/row-grouping/',
      },
      {
        title: 'Data Grid – Charts integration [Premium]',
        url: '/x/react-data-grid/charts-integration/',
      },
      {
        title: 'Data Grid – Export resilience [Premium]',
        url: '/x/react-data-grid/export/',
      },
      {
        title: 'Data Grid – Smoother reordering with clear affordances [Pro]',
        url: '/x/react-data-grid/row-ordering/',
      },
      {
        title: 'Data Grid – Pinned areas and scrolling polish',
        url: '/x/react-data-grid/scrolling/',
      },
      {
        title: 'Charts – Sankey chart [Pro]',
        url: '/x/react-charts/sankey/',
      },
      {
        title: 'Charts – Funnel chart polished presets [Pro]',
        url: '/x/react-charts/funnel/',
      },
      {
        title: 'Charts – Intuitive zooming and panning [Pro]',
        url: '/x/react-charts/zoom-and-pan/',
      },
      {
        title: 'Charts – Zoom slider with preview [Pro]',
        url: '/x/react-charts/zoom-and-pan/#zoom-slider',
      },
      {
        title: 'Charts – Brush selection',
        url: '/x/react-charts/brush/',
      },
      {
        title: 'Charts – Keyboard navigation and a11y improvements',
        url: '/x/react-charts/accessibility/',
      },
      {
        title: 'Date and Time Pickers – Better range defaults [Pro]',
        url: '/x/react-date-pickers/base-concepts/',
      },
      {
        title: 'Date and Time Pickers – Polished inputs across devices',
        url: '/x/react-date-pickers/',
      },
      {
        title: 'Tree View – Drag-and-drop support and other improvements',
        url: '/x/react-tree-view/',
      },
    ],
  },
  {
    title: 'MUI X v8',
    description: 'Cutting-edge features, enhanced customization, and full support for native ESM.',
    date: new Date(2025, 3, 17),
    url: 'https://mui.com/blog/mui-x-v8/',
    highlightList: [
      {
        title: 'Data Grid – Pivoting [Premium]',
        url: 'https://mui.com/blog/mui-x-v8/#pivoting',
      },
      {
        title: 'Data Grid – Ask Your Table (AI Assistance) [Premium]',
        url: 'https://mui.com/blog/mui-x-v8/#ask-your-table-ai-assistance-in-the-data-grid',
      },
      {
        title: 'Data Grid – Server-side aggregation and Lazy loading [Premium/Pro]',
        url: 'https://mui.com/blog/mui-x-v8/#server-side-aggregation-and-lazy-loading',
      },
      {
        title: 'Data Grid – Data source with support for editing',
        url: 'https://mui.com/blog/mui-x-v8/#data-source-with-support-for-editing',
      },
      {
        title: 'Data Grid – Data source on the community plan',
        url: 'https://mui.com/blog/mui-x-v8/#data-source-on-the-community-plan',
      },
      {
        title: 'Data Grid – New toolbar',
        url: 'https://mui.com/blog/mui-x-v8/#new-toolbar',
      },
      {
        title: 'Data Grid – No columns overlay',
        url: 'https://mui.com/blog/mui-x-v8/#no-columns-overlay',
      },
      {
        title: 'Date and Time Pickers – Time Range Picker [Pro]',
        url: 'https://mui.com/blog/mui-x-v8/#time-range-picker',
      },
      {
        title: 'Date and Time Pickers – New view-switching strategy',
        url: 'https://mui.com/blog/mui-x-v8/#new-view-switching-strategy',
      },
      {
        title: 'Date and Time Pickers – Clear "ownerState" for slots',
        url: 'https://mui.com/blog/mui-x-v8/#clear-ownerstate-for-slots',
      },
      {
        title: 'Date and Time Pickers – Accessible DOM structure',
        url: 'https://mui.com/blog/mui-x-v8/#accessible-dom-structure',
      },
      {
        title: 'Date and Time Pickers – Keyboard editing on mobile pickers',
        url: 'https://mui.com/blog/mui-x-v8/#keyboard-editing-on-mobile-pickers',
      },
      {
        title: 'Tree View – Lazy loading children [Pro]',
        url: 'https://mui.com/blog/mui-x-v8/#lazy-loading-children',
      },
      {
        title: 'Tree View – Automatic selection propagation',
        url: 'https://mui.com/blog/mui-x-v8/#automatic-selection-propagation',
      },
      {
        title: 'Tree View – New customization hook',
        url: 'https://mui.com/blog/mui-x-v8/#new-customization-hook',
      },
      {
        title: 'Charts – Funnel charts [Pro]',
        url: 'https://mui.com/blog/mui-x-v8/#funnel-charts',
      },
      {
        title: 'Charts – Radar charts',
        url: 'https://mui.com/blog/mui-x-v8/#radar-charts',
      },
      {
        title: 'Charts – New animation engine',
        url: 'https://mui.com/blog/mui-x-v8/#new-animation-engine',
      },
      {
        title: 'Charts – Server-side rendering for charts',
        url: 'https://mui.com/blog/mui-x-v8/#server-side-rendering-for-charts',
      },
      {
        title: 'Charts – Refined design and interaction',
        url: 'https://mui.com/blog/mui-x-v8/#refined-design-and-interaction',
      },
      {
        title: 'Charts – HTML legend for Charts',
        url: 'https://mui.com/blog/mui-x-v8/#html-legend-for-charts',
      },
      {
        title: 'Charts – Composition',
        url: 'https://mui.com/blog/mui-x-v8/#charts-composition',
      },
    ],
  },
  {
    title: 'MUI X v7.19',
    description: 'A roundup of all new features since v7.15.0.',
    date: new Date(2024, 9, 4),
    url: 'https://github.com/mui/mui-x/releases/tag/v7.19.0',
    highlightList: [
      {
        title: 'Data Grid – Row spanning',
        url: '/x/react-data-grid/row-spanning/',
      },
      {
        title: 'Data Grid – Automatic parent and child selection',
        url: '/x/react-data-grid/row-grouping/#automatic-parent-and-child-selection',
      },
      {
        title: 'Date and Time Pickers – Support date-fns v4',
        url: '/x/react-date-pickers/adapters-locale/#with-date-fns',
      },
    ],
  },
  {
    title: 'MUI X v7.15',
    date: new Date(2024, 7, 29),
    description: 'A roundup of all new features since v7.13.0.',
    url: 'https://github.com/mui/mui-x/releases/tag/v7.15.0',
    highlightList: [
      {
        title: 'Material UI v6 support',
        url: 'https://github.com/mui/mui-x/releases/tag/v7.15.0',
      },
      {
        title: 'Charts – Zoom filtering',
        url: '/x/react-charts/zoom-and-pan/#zoom-filtering',
      },
    ],
  },
  {
    title: 'MUI X v7.13',
    date: new Date(2024, 7, 16),
    description: 'A roundup of all new features since v7.8.0.',
    url: 'https://github.com/mui/mui-x/releases/tag/v7.13.0',
    highlightList: [
      {
        title: 'Data Grid – Loading overlay variants',
        url: '/x/react-data-grid/overlays/#loading-overlay',
      },
      {
        title: 'Rich Tree View – Drag-and-drop re-ordering',
        url: '/x/react-tree-view/rich-tree-view/ordering/',
      },
      {
        title: 'Rich Tree View – Label editing',
        url: '/x/react-tree-view/rich-tree-view/editing/',
      },
      {
        title: 'Charts – Heatmap',
        url: '/x/react-charts/heatmap/',
      },
      {
        title: 'Charts – Zoom and pan',
        url: '/x/react-charts/zoom-and-pan/',
      },
      {
        title: 'Charts – Color legend',
        url: '/x/react-charts/legend/#color-legend',
      },
    ],
  },
  {
    title: 'MUI X v7.8',
    date: new Date(2024, 5, 28),
    description: 'A roundup of all new features since v7.0.0.',
    url: 'https://github.com/mui/mui-x/releases/tag/v7.8.0',
    highlightList: [
      {
        title: 'Data Grid – Server-side Data Source',
        url: '/x/react-data-grid/server-side-data/',
      },
      {
        title: 'Data Grid – Support unknown and estimated row count in server-side pagination',
        url: '/x/react-data-grid/pagination/#index-based-pagination',
      },
      {
        title: 'Charts – Color scales',
        url: '/x/react-charts/styling/#value-based-colors',
      },
    ],
  },
  {
    title: 'MUI X v7',
    description:
      'Featuring new components and multiple enhancements for both developers and end-users.',
    date: new Date(2024, 2, 21),
    url: 'https://mui.com/blog/mui-x-v7/',
    highlightList: [
      {
        title: 'Data Grid – Column resizing on the Community plan',
        url: 'https://mui.com/blog/mui-x-v7/#column-resizing-on-the-community-plan',
      },
      {
        title: 'Data Grid – Sticky headers and improved scrolling performance',
        url: 'https://mui.com/blog/mui-x-v7/#sticky-headers-and-improved-scrolling-performance',
      },
      {
        title: 'Data Grid – Improved columns panel design',
        url: 'https://mui.com/blog/mui-x-v7/#improved-columns-panel-design',
      },
      {
        title: 'Data Grid – New stable features',
        url: 'https://mui.com/blog/mui-x-v7/#new-stable-features',
      },
      {
        title: 'Rich Tree View',
        url: 'https://mui.com/blog/mui-x-v7/#rich-tree-view',
      },
      {
        title: 'Charts – Gauge charts',
        url: 'https://mui.com/blog/mui-x-v7/#gauge-charts',
      },
      {
        title: 'Charts – Reference line',
        url: 'https://mui.com/blog/mui-x-v7/#reference-line',
      },
      {
        title: 'Date Time Range Picker',
        url: 'https://mui.com/blog/mui-x-v7/#date-time-range-picker',
      },
      {
        title: 'Support for date-fns v3',
        url: 'https://mui.com/blog/mui-x-v7/#support-for-date-fns-v3',
      },
    ],
  },
  {
    title: 'MUI X v6.18',
    description: 'New stable components, polished features, better performance, and more.',
    date: new Date(2023, 10, 13),
    url: 'https://mui.com/blog/mui-x-end-v6-features/',
    highlightList: [
      {
        title: 'Charts goes stable!',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#charts',
      },
      {
        title: 'Tree View goes stable!',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#tree-view',
      },
      {
        title: 'Clearable Date and Time fields',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#clearable-field',
      },
      {
        title: 'Customization playgrounds for Date and Time Pickers',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#customization-playgrounds',
      },
      {
        title: 'Data Grid column autosizing',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#column-autosizing',
      },
      {
        title: 'Sparkline charts on the Data Grid ',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#sparkline-as-a-column-type',
      },
    ],
  },
  {
    title: 'MUI X v6.11',
    description: 'A roundup of all new features since v6.0.0.',
    date: new Date(2023, 7, 14),
    url: 'https://mui.com/blog/mui-x-mid-v6-features/',
    highlightList: [
      {
        title: 'Support for timezone on Date and Time Pickers',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#support-for-time-zones',
      },
      {
        title: 'Digital Clock',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#digital-clock',
      },
      {
        title: 'Data Grid: Column header filters',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#filter-on-column-headers',
      },
      {
        title: 'Data Grid: Copy and paste',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#copy-and-paste',
      },
      {
        title: 'Charts move to Alpha 🧪',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#charts-alpha-version',
      },
      {
        title: 'TreeView migration from the lab',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#tree-view-is-moving-to-mui-x',
      },
    ],
  },
  {
    title: 'MUI X v6',
    description: 'A new major is available, with many new features and improvements.',
    date: new Date(2023, 2, 6),
    url: 'https://mui.com/blog/mui-x-v6/',
    highlightList: [
      {
        title: 'Date and Time Pickers',
        url: 'https://mui.com/blog/mui-x-v6/#fields-the-new-default-input-gt-for-pickers',
      },
      {
        title: 'Date Range shortcuts',
        url: 'https://mui.com/blog/mui-x-v6/#shortcuts-for-picking-specific-dates-in-a-calendar',
      },
      {
        title: 'Improved layout customization',
        url: 'https://mui.com/blog/mui-x-v6/#improved-layout-customization',
      },
      {
        title: 'Edit ranges with drag and drop',
        url: 'https://mui.com/blog/mui-x-v6/#edit-date-ranges-with-drag-and-drop',
      },
      {
        title: 'New Column menu',
        url: 'https://mui.com/blog/mui-x-v6/#improved-column-menu',
      },
      {
        title: 'ApiRef in the community version',
        url: 'https://mui.com/blog/mui-x-v6/#apiref-moved-to-the-mit-community-version',
      },
      {
        title: 'Cell selection',
        url: 'https://mui.com/blog/mui-x-v6/#cell-selection',
      },
    ],
  },
  {
    title: 'MUI X Date Pickers v5',
    description:
      'After some months of polishing in pre-releases, the Date Pickers finally get a stable.',
    date: new Date(2022, 8, 22),
    url: 'https://mui.com/blog/date-pickers-stable-v5/',
    highlightList: [
      {
        title: 'Better APIs',
        url: 'https://mui.com/blog/date-pickers-stable-v5/#better-apis-and-improved-customization',
      },
      {
        title: 'Easier customization',
        url: 'https://mui.com/blog/date-pickers-stable-v5/#better-apis-and-improved-customization',
      },
      {
        title: 'Integrated localization',
        url: 'https://mui.com/blog/date-pickers-stable-v5/#integrated-localization',
      },
    ],
  },
  {
    title: 'MUI X Data Grid v5.15',
    description:
      'This version brings an amazing set of new supported use cases with the Data Grid Premium.',
    date: new Date(2022, 7, 12),
    url: 'https://mui.com/blog/aggregation-functions/',
    highlightList: [
      {
        title: 'Aggregation in summary rows and row groups',
        url: 'https://mui.com/blog/aggregation-functions/#wait-what-is-an-aggregation-function',
      },
      {
        title: 'Row pinning',
        url: 'https://mui.com/blog/aggregation-functions/#row-pinning',
      },
    ],
  },
  {
    title: 'New Premium plan',
    description:
      'Premium plan announcement, including the most advanced features for data analysis and management.',
    date: new Date(2022, 4, 12),
    url: 'https://mui.com/blog/premium-plan-release/',
    highlightList: [
      { title: 'Row Grouping', url: '/x/react-data-grid/row-grouping/' },
      { title: 'Excel export', url: '/x/react-data-grid/export/#exported-rows' },
    ],
  },
  {
    title: 'MUI X v5',
    description: 'A new Data Grid virtualization engine, and improvements in several APIs.',
    date: new Date(2021, 10, 22),
    url: 'https://mui.com/blog/mui-x-v5/',
    highlightList: [
      {
        title: 'New virtualization engine',
        url: 'https://mui.com/blog/mui-x-v5/#a-new-virtualization-engine',
      },
      {
        title: 'Improved state management',
        url: 'https://mui.com/blog/mui-x-v5/#improved-state-management',
      },
      {
        title: 'Simplified style customization',
        url: 'https://mui.com/blog/mui-x-v5/#simplified-style-customization',
      },
    ],
  },
];

function BlogCard({ entry }) {
  return (
    <Card
      variant="outlined"
      sx={{
        background: 'transparent',
        borderColor: 'divider',
        // TODO: Allow to use theme.applyDarkStyles
        '.mode-dark &': {
          color: 'primary.300',
          background: 'transparent',
          borderColor: 'divider',
        },
      }}
    >
      <Box
        sx={(theme) => ({
          p: 2.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
          background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
          // TODO: Allow to use theme.applyDarkStyles
          '.mode-dark &': {
            bgcolor: 'primaryDark.900',
            background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
          },
        })}
      >
        <div>
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              color: 'text.tertiary',
              display: { xs: 'auto', sm: 'none' },
            }}
          >
            {entry.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
          <Typography
            component="div"
            sx={{
              color: 'text.primary',
              fontWeight: 'bold',
              mb: 0.2,
            }}
          >
            {entry.title}
          </Typography>
          <Typography
            component="div"
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {entry.description}
          </Typography>
        </div>
        {entry.url && (
          <Button
            component="a"
            size="small"
            variant="outlined"
            href={entry.url}
            sx={{
              height: 'fit-content',
              flexShrink: 0,
              width: { xs: '100%', sm: 'fit-content' },
            }}
          >
            Read more
          </Button>
        )}
      </Box>
      <Divider />
      <List sx={{ p: 2, pt: 1.5 }}>
        {entry.highlightList.map((item) => (
          <ListItem
            key={item.title}
            sx={{
              py: 0.5,
              px: 0.5,
              display: 'flex',
              alignItems: 'flex-start',
              lineHeight: '22px',
              [`&:before`]: {
                content: '"➞"',
                opacity: '50%',
                color: 'primary.300',
                lineHeight: '22px',
              },
            }}
          >
            <Link
              href={item.url}
              variant="body2"
              sx={{
                pl: 1.5,
                fontWeight: 'medium',
              }}
            >
              {item.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

BlogCard.propTypes = {
  entry: PropTypes.any,
};

export default function WhatsNewLayout() {
  return (
    <div>
      <Timeline
        sx={{
          p: 0,
          px: { xs: 2, sm: 0 },
          'li:first-child': {
            '& .top-connector': {
              visibility: 'hidden',
            },
          },
          'li:last-child': {
            '& .MuiTimelineContent-root': {
              pb: 0,
            },
            '& .bottom-connector': {
              visibility: 'hidden',
            },
          },
        }}
      >
        {entries.map((entry) => (
          <TimelineItem key={entry.date.toISOString()}>
            <TimelineOppositeContent
              variant="body2"
              sx={{
                color: 'text.tertiary',
                display: { xs: 'none', sm: 'flex' },
                flex: 'none',
                px: 0,
                pt: 3.5,
                pr: 3,
                width: 120,
                textAlign: 'left',
                fontWeight: 'medium',
              }}
            >
              {entry.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector
                className="top-connector"
                sx={{
                  height: 32,
                  flexGrow: 0,
                  width: '1px',
                  backgroundColor: 'grey.100',
                  // TODO: Allow to use theme.applyDarkStyles
                  '.mode-dark &': { backgroundColor: 'primaryDark.700' },
                }}
              />
              <TimelineDot
                sx={{
                  m: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderColor: 'grey.500',
                  opacity: '60%',
                  borderWidth: '1px',
                }}
              />
              <TimelineConnector
                className="bottom-connector"
                sx={{
                  width: '1px',
                  backgroundColor: 'grey.100',
                  // TODO: Allow to use theme.applyDarkStyles
                  '.mode-dark &': { backgroundColor: 'primaryDark.700' },
                }}
              />
            </TimelineSeparator>
            <TimelineContent sx={{ pl: { xs: 2, sm: 4 }, pr: 0, pt: 0, pb: 3 }}>
              <BlogCard entry={entry} />
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
