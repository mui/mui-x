import * as React from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    {
      id: 'A',
      children: [
        { id: 'A1', value: 30 },
        { id: 'A2', value: 20 },
        { id: 'A3', value: 12 },
      ],
    },
    {
      id: 'B',
      children: [
        { id: 'B1', value: 25 },
        { id: 'B2', value: 15 },
      ],
    },
    {
      id: 'C',
      children: [
        { id: 'C1', value: 18 },
        { id: 'C2', value: 10 },
      ],
    },
  ],
};

export default function TreemapStyling() {
  const [borderRadius, setBorderRadius] = React.useState(4);
  const [paddingInner, setPaddingInner] = React.useState(2);
  const [paddingOuter, setPaddingOuter] = React.useState(2);
  const [paddingTop, setPaddingTop] = React.useState(24);

  const controls = [
    {
      label: 'Border radius',
      value: borderRadius,
      setValue: setBorderRadius,
      max: 20,
    },
    {
      label: 'Padding inner',
      value: paddingInner,
      setValue: setPaddingInner,
      max: 20,
    },
    {
      label: 'Padding outer',
      value: paddingOuter,
      setValue: setPaddingOuter,
      max: 20,
    },
    { label: 'Padding top', value: paddingTop, setValue: setPaddingTop, max: 40 },
  ];

  return (
    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
        {controls.map((control) => (
          <Stack
            key={control.label}
            direction="column"
            sx={{ flex: 1, minWidth: 140 }}
          >
            <Typography gutterBottom>{control.label}</Typography>
            <Slider
              value={control.value}
              onChange={(event, value) => control.setValue(value)}
              valueLabelDisplay="auto"
              min={0}
              max={control.max}
            />
          </Stack>
        ))}
      </Stack>
      <Treemap
        series={{
          data,
          tiling: { paddingInner, paddingOuter, paddingTop },
          nodeOptions: { borderRadius },
        }}
        height={320}
      />
      <HighlightedCode
        code={`<Treemap
  series={{
    // ...
    tiling: { paddingInner: ${paddingInner}, paddingOuter: ${paddingOuter}, paddingTop: ${paddingTop} },
    nodeOptions: { borderRadius: ${borderRadius} },
  }}
/>`}
        language="jsx"
        copyButtonHidden
      />
    </Stack>
  );
}
