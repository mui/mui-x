import * as React from 'react';
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
    title: 'MUI X v7.0.0',
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
        title: 'Charts - Gauge charts',
        url: 'https://mui.com/blog/mui-x-v7/#gauge-charts',
      },
      {
        title: 'Charts - Reference line',
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
    title: 'MUI X v6.18.0',
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
        title: 'Sparkline Charts on the Data Grid ',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#sparkline-as-a-column-type',
      },
    ],
  },
  {
    title: 'MUI X v6.11.0',
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
    title: 'MUI X v6.0.0',
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
    title: 'MUI X Date Pickers v5.0.0',
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
    title: 'MUI X Data Grid v5.15.0',
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
    title: 'MUI X v5.0.0',
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
            color="text.tertiary"
            gutterBottom
            sx={{ display: { xs: 'auto', sm: 'none' } }}
          >
            {entry.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
          <Typography component="div" color="text.primary" fontWeight="bold" mb={0.2}>
            {entry.title}
          </Typography>
          <Typography component="div" color="text.secondary" variant="body2">
            {entry.description}
          </Typography>
        </div>
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
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          {'Read more'}
        </Button>
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
              color="text.tertiary"
              sx={{
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
