// @ts-nocheck
/* eslint-disable */
import * as React from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

// Use this space to add tests that touch multiple codemods in the preset-safe package
// It is important to ensure that the codemods don't conflict with each other
// For example, if one codemod changes a prop name, another codemod modifying its value should work too.
// Don't hesitate to add props on existing components.

// prettier-ignore
<div>
  <Heatmap series={[{}]} hideLegend />
  <HeatmapPremium series={[{}]} hideLegend={false} />
  <Heatmap hideLegend series={[{}]} />
  <HeatmapPremium hideLegend {...otherProps} />
  <PieArc seriesId="test" />
  <SankeyChart series={{}} />
</div>;
