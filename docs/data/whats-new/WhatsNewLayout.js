import * as React from 'react';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const blogs = [
  {
    title: 'MUI X v6.11.0',
    description: 'A roundup of all new features since v6.0.0.',
    announcementDate: 'Mon, Aug 14, 2023',
    url: 'https://mui.com/blog/mui-x-mid-v6-features/',
    highlightList: [
      {
        name: 'Support for timezone on Date and Time Pickers',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#support-for-time-zones',
      },
      {
        name: 'Digital Clock',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#digital-clock',
      },
      {
        name: 'Filters on Data Grid column headers',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#filter-on-column-headers',
      },
      {
        name: 'Copy and Paste on Data Grid',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#copy-and-paste',
      },
      {
        name: 'Charts Alpha 🧪',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#charts-alpha-version',
      },
      {
        name: 'TreeView migration from lab',
        link: 'https://mui.com/blog/mui-x-mid-v6-features/#tree-view-is-moving-to-mui-x',
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
        name: 'Date and time fields',
        link: 'https://mui.com/blog/mui-x-v6/#fields-the-new-default-input-gt-for-pickers',
      },
      {
        name: 'Date Range shortcuts',
        link: 'https://mui.com/blog/mui-x-v6/#shortcuts-for-picking-specific-dates-in-a-calendar',
      },
      {
        name: 'Improved layout customization',
        link: 'https://mui.com/blog/mui-x-v6/#improved-layout-customization',
      },
      {
        name: 'Edit ranges with drag and drop',
        link: 'https://mui.com/blog/mui-x-v6/#edit-date-ranges-with-drag-and-drop',
      },
      {
        name: 'New Column menu',
        link: 'https://mui.com/blog/mui-x-v6/#improved-column-menu',
      },
      {
        name: 'ApiRef in community',
        link: 'https://mui.com/blog/mui-x-v6/#apiref-moved-to-the-mit-community-version',
      },
      {
        name: 'Cell selection',
        link: 'https://mui.com/blog/mui-x-v6/#cell-selection',
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
        name: 'Better APIs',
        link: 'https://mui.com/blog/date-pickers-stable-v5/#better-apis-and-improved-customization',
      },
      {
        name: 'Easier customization',
        link: 'https://mui.com/blog/date-pickers-stable-v5/#better-apis-and-improved-customization',
      },
      {
        name: 'Integrated localization',
        link: 'https://mui.com/blog/date-pickers-stable-v5/#integrated-localization',
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
        name: 'Aggregation in summary rows and row groups',
        link: 'https://mui.com/blog/aggregation-functions/#wait-what-is-an-aggregation-function',
      },
      {
        name: 'Row pinning',
        link: 'https://mui.com/blog/aggregation-functions/#row-pinning',
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
      { name: 'Row Grouping', link: '/x/react-data-grid/row-grouping/' },
      { name: 'Excel export', link: '/x/react-data-grid/export/#exported-rows' },
    ],
  },
  {
    title: 'MUI X v5.0.0',
    description: 'A new virtualization engine, and improvements in several APIs.',
    announcementDate: 'Monday, Nov 22, 2021',
    url: 'https://mui.com/blog/mui-x-v5/',
    highlightList: [
      {
        name: 'New virtualization engine',
        link: 'https://mui.com/blog/mui-x-v5/#a-new-virtualization-engine',
      },
      {
        name: 'Improved state management',
        link: 'https://mui.com/blog/mui-x-v5/#improved-state-management',
      },
      {
        name: 'Simplified style customization',
        link: 'https://mui.com/blog/mui-x-v5/#simplified-style-customization',
      },
    ],
  },
];

function BlogCard(props) {
  return (
    <Card
      sx={(theme) => ({
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
            ? 'primaryDark.700'
            : `${alpha(theme.palette.grey[50], 0.4)}`,
        borderColor: 'divider',
      })}
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

          <List sx={{ listStyle: 'circle', pb: 0 }}>
            {props.blog.highlightList.map((item) => (
              <ListItem
                sx={{
                  py: 0.5,
                  px: 0.5,
                  [`&:before`]: {
                    content: '"•"',
                    color: 'grey',
                  },
                }}
              >
                <Typography sx={{ pl: 1 }} variant="body2">
                  <Link
                    sx={{ cursor: 'pointer' /*, color: '#818181'*/ }}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
      <CardActions
        sx={{ justifyContent: 'center', flex: '1 1 auto', m: 0, alignItems: 'end' }}
      >
        <Button sx={{ width: '100%' }} href={props.blog.url}>
          Read more
        </Button>
      </CardActions>
    </Card>
  );
}

export default function PickersPlaygroundWrapper() {
  return (
    <Grid container spacing={2} sx={{ pt: 2, pb: 4 }}>
      {blogs.map((blog) => (
        <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }} key={blog.title}>
          <BlogCard blog={blog} />
        </Grid>
      ))}
    </Grid>
  );
}
