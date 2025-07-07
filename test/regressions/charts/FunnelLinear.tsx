import * as React from 'react';
import { Stack } from '@mui/material';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

const data = [{ value: 30 }, { value: 20 }, { value: 25 }, { value: 15 }, { value: 10 }];

export default function FunnelLinearAndDirection() {
  const props = {
    curveType: 'linear',
    borderRadius: 10,
    gap: 0,
  } as const;

  return (
    <Stack sx={{ width: '100%' }} flexDirection={'row'}>
      <Stack flex={1}>
        <div>Linear & decreasing</div>
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'decreasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'decreasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'decreasing',
              data,
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'decreasing',
              data,
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
      </Stack>
      <Stack flex={1}>
        <div>Band & decreasing</div>
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'decreasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'decreasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'decreasing',
              data,
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'decreasing',
              data,
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
      </Stack>
      <Stack flex={1}>
        <div>Linear & increasing</div>
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'increasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'increasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'increasing',
              data,
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'increasing',
              data,
            },
          ]}
          gap={props.gap}
          categoryAxis={{ scaleType: 'linear' }}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
      </Stack>
      <Stack flex={1}>
        <div>Band & increasing</div>
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'increasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'increasing',
              data: data.toReversed(),
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'vertical',
              funnelDirection: 'increasing',
              data,
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
        <FunnelChart
          series={[
            {
              curve: props.curveType,
              borderRadius: props.borderRadius,
              layout: 'horizontal',
              funnelDirection: 'increasing',
              data,
            },
          ]}
          gap={props.gap}
          height={180}
          slotProps={{ legend: { direction: 'vertical' } }}
        />
      </Stack>
    </Stack>
  );
}
