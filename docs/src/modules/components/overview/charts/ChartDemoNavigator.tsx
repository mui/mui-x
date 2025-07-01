import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import InfoCard from '../InfoCard';

export interface DemoDescription {
  title: string;
  description: string;
  iconLink?: string;
}

export default function ChartDemoNavigator(
  props: React.PropsWithChildren<{
    overline: string;
    descriptions: DemoDescription[];
    activeItem: number;
    setActiveItem: React.Dispatch<React.SetStateAction<number>>;
  }>,
) {
  const { descriptions, overline, activeItem, setActiveItem, children } = props;

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 6 }}
        py={8}
        alignItems="start"
      >
        <Stack
          spacing={2}
          sx={{
            width: { xs: '100%', md: 500 },
            minWidth: '260px',
            maxWidth: { xs: '500px', md: '400px' },
          }}
        >
          <SectionHeadline
            overline={overline}
            title={
              <Typography variant="h2" fontSize="1.625rem">
                {descriptions[activeItem].title}
              </Typography>
            }
          />
          <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 1, md: 2 }} overflow="auto">
            {descriptions.map(({ title, description, iconLink }, index) => (
              <Box key={index} sx={{ minWidth: 150 }}>
                <InfoCard
                  title={title}
                  description={isLargeScreen ? description : ''}
                  active={activeItem === index}
                  onClick={() => setActiveItem(index)}
                  backgroundColor="subtle"
                  icon={iconLink ? <img src={iconLink} width={16} height={16} alt="" /> : null}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: { xs: '100%' },
            maxWidth: { xs: '500px', md: '100%' },
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {children}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
