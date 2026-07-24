import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { colorFull, sxExpressiveColors } from './colors';

const Circle = styled('div')({
  borderRadius: '50%',
  flexShrink: 0,
  width: 22,
  height: 22,
  marginLeft: -5,
  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.72)',
});

const colorStops = colorFull.flatMap((_, index) => [
  { colorIndex: index, mix: 68 },
  { colorIndex: index, mix: 100 },
]);

export default function ColorPaletteSequence() {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
        ...(Array.isArray(sxExpressiveColors) ? sxExpressiveColors : [sxExpressiveColors]),
      ]}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2">Customization and styling</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Fine-grained control over appearance to match your brand and style.
        </Typography>
      </Box>
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          pl: 0.625,
        }}
      >
        {colorStops.map(({ colorIndex, mix }) => (
          <Circle
            key={`${colorIndex}-${mix}`}
            sx={{
              backgroundColor:
                mix === 100
                  ? `var(--palette-color-${colorIndex})`
                  : `color-mix(in srgb, var(--palette-color-${colorIndex}) ${mix}%, white)`,
              transition: 'background-color 0.5s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
