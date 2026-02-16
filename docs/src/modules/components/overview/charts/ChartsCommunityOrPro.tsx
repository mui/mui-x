import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function ChartsCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 2 }}
        py={8}
        alignItems="center"
        maxWidth={1200}
        mx="auto"
      >
        <CommunityOrPro
          caption={'Community, Pro and Premium'}
          title={'Three packages for every growing need'}
          description={
            "Start with the free-forever Community version, then upgrade to Pro or Premium as your needs grow."
          }
          communityDescription={
            'Free forever under an MIT license. Includes core chart types and building blocks like axes, legends, theming, tooltips, and highlights.'
          }
          proDescription={
            'Built for data-rich production apps. Commercial license. Includes advanced charts (funnel, heatmap, sankey) and interactions like zooming, panning, and exporting.'
          }
          premiumDescription={
            'Maximum performance for dense data visualizations. Includes WebGL rendering for smooth interaction at scale, plus candlestick, OHLC charts, and (coming soon) annotations and AI assistance.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
