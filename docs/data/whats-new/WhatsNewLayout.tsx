import * as React from 'react';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

type Blog = {
  title: string;
  announcementDate: string;
  description: string;
  url: string;
  highlightList: { title: string; url: string }[];
};

const blogs: Blog[] = [
  {
    title: 'MUI X v6.18.x',
    description:
      'New stable components, polished features, better performance, and more.',
    announcementDate: 'Monday, Nov 13, 2023',
    url: 'https://mui.com/blog/mui-x-end-v6-features/',
    highlightList: [
      {
        title: 'Charts - stable version',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#charts',
      },
      {
        title: 'Tree View - stable version',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#tree-view',
      },
      {
        title: 'Clearable date and time fields',
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
        title: 'Sparklines on Data Grid ',
        url: 'https://mui.com/blog/mui-x-end-v6-features/#sparkline-as-a-column-type',
      },
    ],
  },
  {
    title: 'MUI X v6.11.0',
    description: 'A roundup of all new features since v6.0.0.',
    announcementDate: 'Monday, Aug 14, 2023',
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
        title: 'Filters on Data Grid column headers',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#filter-on-column-headers',
      },
      {
        title: 'Copy and Paste on Data Grid',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#copy-and-paste',
      },
      {
        title: 'Charts Alpha 🧪',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#charts-alpha-version',
      },
      {
        title: 'TreeView migration from lab',
        url: 'https://mui.com/blog/mui-x-mid-v6-features/#tree-view-is-moving-to-mui-x',
      },
    ],
  },
  {
    title: 'MUI X v6.0.0',
    description:
      'A new major is available, with many new features and improvements.',
    announcementDate: 'Monday, Mar 06, 2023',
    url: 'https://mui.com/blog/mui-x-v6/',
    highlightList: [
      {
        title: 'Date and time fields',
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
        title: 'ApiRef in community',
        url: 'https://mui.com/blog/mui-x-v6/#apiref-moved-to-the-mit-community-version',
      },
      {
        title: 'Cell selection',
        url: 'https://mui.com/blog/mui-x-v6/#cell-selection',
      },
    ],
  },
  {
    title: 'Date Pickers v5.0.0',
    description:
      'After some months of polishing in pre-releases, the Date Pickers finally get a stable.',
    announcementDate: 'Monday, Sep 22, 2022',
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
    title: 'Data Grid v5.15',
    description:
      'This version brings an amazing set of new supported use cases with the Data Grid Premium.',
    announcementDate: 'Monday, Aug 12, 2022',
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
    announcementDate: 'Thursday, May 12, 2022',
    url: 'https://mui.com/blog/premium-plan-release/',
    highlightList: [
      { title: 'Row Grouping', url: '/x/react-data-grid/row-grouping/' },
      { title: 'Excel export', url: '/x/react-data-grid/export/#exported-rows' },
    ],
  },
  {
    title: 'MUI X v5.0.0',
    description: 'A new virtualization engine, and improvements in several APIs.',
    announcementDate: 'Monday, Nov 22, 2021',
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

function BlogCard(props: { blog: Blog }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        pt: 2,
        pb: 0,
        gap: 1.5,
        borderRadius: '12px',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(0, 27, 55, 0.2)'
            : `${alpha(theme.palette.grey[50], 0.4)}`,
        borderColor: 'divider',
        [`& .MuiTypography-root`]: {
          fontFamily: 'IBM Plex Sans',
        },
      }}
      component="article"
      variant="outlined"
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            marginBottom: 1,
            px: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {props.blog.announcementDate}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {props.blog.title}
          </Typography>
        </Box>

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" component="div" color="text.secondary">
            {props.blog.description}
          </Typography>

          <List sx={{ pb: 0, mt: 0.5 }}>
            {props.blog.highlightList.map((item) => (
              <ListItem
                key={item.title}
                sx={{
                  py: 0.5,
                  px: 0.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: '22px',
                  [`&:before`]: {
                    content: '"•"',
                    color: 'grey',
                    lineHeight: '22px',
                  },
                }}
              >
                <Link
                  href={item.url}
                  sx={{ pl: 1, fontWeight: 500 }}
                  variant="body2"
                >
                  {item.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'center',
          flex: '1 1 auto',
          m: 0,
          alignItems: 'end',
        }}
      >
        <Button sx={{ width: '100%' }} href={props.blog.url}>
          Read more
        </Button>
      </CardActions>
    </Card>
  );
}

export default function WhatsNewLayout() {
  return (
    <Grid container spacing={2} sx={{ pt: 2, pb: 4 }}>
      {blogs.map((blog) => (
        <Grid item xs={12} sm={6} md={4} sx={{ flexGrow: 1 }} key={blog.title}>
          <BlogCard blog={blog} />
        </Grid>
      ))}
    </Grid>
  );
}
