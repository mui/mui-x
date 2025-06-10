import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import InfoCard from '../../InfoCard';
import LineChartDemo from './LineChartDemo';
import MultiAxesDemo from './MultiAxesDemo';
import PieChartDemo from './PieChartDemo';
import ScatterChartDemo from './ScatterChartDemo';

const advancedFeatures = [
  {
    title: 'Multi axes and series',
    description: 'Support multiple axes and chart types',
  },
  {
    title: 'Heatmap',
    description: 'Offers an intuitive and efficient way to reorganize the tree structure.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Funnel',
    description: 'Improves performance by loading children on demand, especially for large trees.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Zoom',
    description: 'Improves performance by loading children on demand, especially for large trees.',
    iconLink: '/static/x/pro.svg',
  },
];

export default function AdvancedCharts() {
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
            overline="Essential charts"
            title={
              <Typography variant="h2" fontSize="1.625rem">
                {advancedFeatures[activeItem].title}
              </Typography>
            }
          />
          {advancedFeatures.map(
            (
              {
                title,
                description,
                // iconLink
              },
              index,
            ) => (
              <InfoCard
                title={title}
                description={description}
                key={index}
                active={activeItem === index}
                onClick={() => setActiveItem(index)}
                backgroundColor="subtle"
                // icon={iconLink ? <img src={iconLink} width={16} height={16} alt="" /> : null}
              />
            ),
          )}
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: { xs: '100%' },
            maxWidth: { xs: '500px', md: '100%' },
          }}
        >
          {activeItem === 0 && <MultiAxesDemo />}
          {activeItem === 1 && <LineChartDemo />}
          {activeItem === 2 && <PieChartDemo />}
          {activeItem === 3 && <ScatterChartDemo />}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
