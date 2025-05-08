import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import InfoCard from '../../InfoCard';
import LabelEditingDemo from './LabelEditingDemo';
import DragAndDropDemo from './DragAndDropDemo';
import LazyLoadingDemo from './LazyLoadingDemo';

const advancedFeatures = [
  {
    title: 'Support for label editing',
    description: 'Provides users with control over the presentation of their data.',
    iconLink: '/static/x/community.svg',
  },
  {
    title: 'Drag and drop reordering',
    description: 'Offers an intuitive and efficient way to reorganize the tree structure.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Lazy loading children',
    description: 'Improves performance by loading children on demand, especially for large trees.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedFeatures() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <React.Fragment>
      <Divider />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} py={8} alignItems="center">
        <Stack
          spacing={2}
          sx={{
            minWidth: '260px',
            maxWidth: { xs: '500px', md: '400px' },
          }}
        >
          <SectionHeadline
            overline="Advanced features"
            title={
              <Typography variant="h2" fontSize="1.625rem">
                {advancedFeatures[activeItem].title}
              </Typography>
            }
          />
          {advancedFeatures.map(({ title, description, iconLink }, index) => (
            <InfoCard
              title={title}
              description={description}
              key={index}
              active={activeItem === index}
              onClick={() => setActiveItem(index)}
              backgroundColor="subtle"
              icon={<img src={iconLink} width={16} height={16} alt="" />}
            />
          ))}
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: { xs: '100%' },
            maxWidth: { xs: '500px', md: '100%' },
          }}
        >
          {activeItem === 0 && <LabelEditingDemo />}
          {activeItem === 1 && <DragAndDropDemo />}
          {activeItem === 2 && <LazyLoadingDemo />}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
