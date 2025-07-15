// @ts-nocheck
import * as React from 'react';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

// prettier-ignore
<div>
  <ChartsXAxis labelFontSize={18} tickFontSize={20} />
  <ChartsXAxis
    labelFontSize={18}
    tickFontSize={20}
    labelStyle={{ fontWeight: 'bold' }}
    tickStyle={{ fontWeight: 'bold' }}
  />
  <ChartsXAxis
    labelFontSize={18}
    tickFontSize={20}
    labelStyle={{ fontWeight: 'bold', fontSize: 10 }}
    tickStyle={{ fontWeight: 'bold', fontSize: 12 }}
  />
</div>;
