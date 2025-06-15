import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import InfoCard from '../../InfoCard';
import MultiAxesDemo from './MultiAxesDemo';
import ZoomAndPanDemo from './ZoomAndPanDemo';
import ExportDemo from './ExportDemo';

const advancedFeatures = [
  {
    title: 'Multi axes and series',
    description:
      'Support multiple axes and chart types to pick the visualization the matches your need.',
  },
  {
    title: 'Zoom & Pan',
    description: 'BUilt-in zoom features to explore the details of your chart.',
    iconLink: '/static/x/pro.svg',
  },
  {
    title: 'Export',
    description: 'Save your charts in PDF, PNG, or JPEG format to share them outside of the web.',
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
            overline="Essential charts"
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
              icon={iconLink ? <img src={iconLink} width={16} height={16} alt="" /> : null}
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
          {activeItem === 0 && <MultiAxesDemo />}
          {activeItem === 1 && <ZoomAndPanDemo />}
          {activeItem === 2 && <ExportDemo />}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
