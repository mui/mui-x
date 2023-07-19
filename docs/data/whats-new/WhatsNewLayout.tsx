import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Blog = {
  title: string;
  announcementDate: string;
  description: string;
  url: string;
  highlightList: string[];
};

function BlogCard(props: { blog: Blog }) {
  return (
    <Card
      sx={{
        margin: '10px',
        flexBasis: '350px',
        display: 'flex',
        flexFlow: 'column',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.25)',
      }}
    >
      {/*<CardMedia
        sx={{ height: 100 }}
        image={props.blog.cardUrl}
        title={props.blog.title}
  />*/}
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: '1px solid #eee', marginBottom: 1, px: 1 }}>
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
                  <Link sx={{ cursor: 'pointer', color: '#818181' }}>{item}</Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
      <CardActions
        sx={{ justifyContent: 'center', flex: '1 1 auto', alignItems: 'end' }}
      >
        <Button sx={{ width: '100%' }} href={props.blog.url}>
          Read more
        </Button>
      </CardActions>
    </Card>
  );
}

export default function PickersPlaygroundWrapper() {
  const blogs: Blog[] = [
    {
      title: 'MUI X v6.10.0',
      description: 'A summary of all key new features since v6.0.0.',
      announcementDate: 'Mon, Jul 31, 2023',
      url: 'https://deploy-preview-37957--material-ui.netlify.app/blog/mui-x-mid-v6-features/',
      highlightList: [
        'New UI for TimePickers(Digital Clock)',
        'Support for timezone on Date and Time Pickers',
        'Copy and Paste on Data Grid',
        'Filters on Data Grid column headers',
        'Charts Alpha 🧪',
      ],
    },
    {
      title: 'MUI X v6.0.0',
      description:
        'A new major is available, with many new features and improvements.',
      announcementDate: 'Monday, Mar 06, 2023',
      url: 'https://mui.com/blog/mui-x-v6/',
      highlightList: [
        'New Fields',
        'Range shortcuts',
        'Improved layout customization',
        'Edit ranges with drag and drop',
        'New Column menu',
        'ApiRef in community',
        'Cell selection',
      ],
    },
    {
      title: 'Date Pickers v5.0.0',
      description:
        'After some months of polishing in pre-releases, the Date Pickers finally get a stable.',
      announcementDate: 'Monday, Sep 22, 2022',
      url: 'https://mui.com/blog/date-pickers-stable-v5/',
      highlightList: [
        'Better APIs',
        'Easier customization',
        'Integrated localization',
      ],
    },
    {
      title: 'Data Grid v5.15',
      description:
        'This version brings an amazing set of new use cases for the Data Grid Premium.',
      announcementDate: 'Monday, Aug 12, 2022',
      url: 'https://mui.com/blog/aggregation-functions/',
      highlightList: ['Aggregation', 'Summary Rows'],
    },
    {
      title: 'New Premium plan',
      description:
        'Premium plan announcement, including the most advanced features for data analysis and management.',
      announcementDate: 'Thursday, May 12, 2022',
      url: 'https://mui.com/blog/premium-plan-release/',
      highlightList: ['Row Grouping', 'Excel export'],
    },
    {
      title: 'MUI X v5.0.0',
      description: 'A new virtualization engine, and improvements in several APIs.',
      announcementDate: 'Monday, Nov 22, 2021',
      url: 'https://mui.com/blog/mui-x-v5/',
      highlightList: ['New virtualization engine', 'Easier customization'],
    },
  ];

  return (
    <Box
      sx={{
        flexFlow: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center',
      }}
    >
      {blogs.map((blog) => (
        <BlogCard blog={blog} />
      ))}
    </Box>
  );
}
