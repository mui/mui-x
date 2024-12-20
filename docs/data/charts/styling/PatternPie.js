import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Stack } from '@mui/system';

export default function PatternPie() {
  return (
    <Stack>
      <PieChart
        sx={{
          '--my-custom-pattern': 'url(#Pattern)',
        }}
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'series A' },
              { id: 1, value: 15, label: 'series B' },
              {
                id: 2,
                value: 20,
                label: 'series C',
                color: 'var(--my-custom-pattern, #123456)',
              },
            ],
          },
        ]}
        width={200}
        height={200}
      >
        <pattern
          id="Pattern"
          patternUnits="userSpaceOnUse"
          width="20"
          height="40"
          patternTransform="scale(0.5)"
        >
          <rect x="0" y="0" width="100%" height="100%" fill="#123456" />
          <path
            d="M0 30h20L10 50zm-10-20h20L0 30zm20 0h20L20 30zM0-10h20L10 10z"
            strokeWidth="1"
            stroke="#81b2e4"
            fill="none"
          />
        </pattern>
      </PieChart>
    </Stack>
  );
}
