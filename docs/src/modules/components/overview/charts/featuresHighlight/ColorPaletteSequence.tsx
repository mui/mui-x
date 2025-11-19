import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { colorFull, sxColors } from './colors';

const Circle = styled('div')({
  display: 'inline-block',
  borderRadius: '50%',
  width: 24,
  height: 24,
  marginRight: -8,
});

export default function ColorPaletteSequence() {
  return (
    <Box sx={sxColors}>
      {colorFull.map((color, index) => (
        <Circle
          key={color}
          sx={{
            backgroundColor: `var(--palette-color-${index}, ${color})`,
            transition: 'background-color 0.5s',
          }}
        />
      ))}
      <Typography variant="subtitle2">Customization and styling</Typography>
      <Typography variant="body2" color="text.secondary">
        Fine-grained control over appearance to match your brand and style.
      </Typography>
    </Box>
  );
}
