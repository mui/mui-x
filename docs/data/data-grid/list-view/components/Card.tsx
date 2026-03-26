import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';

export function Card(props: StackProps) {
  const { children, ...other } = props;
  return (
    <Stack
      direction="row"
      {...other}
      sx={[{
        gap: 2,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        ...(other.sx || {})
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      {children}
    </Stack>
  );
}

export function CardMedia(props: StackProps) {
  const { children, ...other } = props;
  return (
    <Stack
      sx={{ flexShrink: 0, alignItems: 'center', ...(other.sx || {}) }}
      {...other}
    >
      {children}
    </Stack>
  );
}

export function CardContent(props: StackProps) {
  const { children, ...other } = props;
  return (
    <Stack
      {...other}
      sx={[{
        gap: 0.25,
        flexGrow: 1,
        ...(other.sx || {})
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      {children}
    </Stack>
  );
}

export function CardTitle(props: TypographyProps) {
  const { children, ...other } = props;
  return (
    <Typography variant="body2" {...other}>
      {children}
    </Typography>
  );
}

export function CardDetailList(props: StackProps) {
  const { children, ...other } = props;
  return (
    <Stack
      direction="row"
      {...other}
      sx={[{
        flexWrap: "wrap",
        gap: 1
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      {children}
    </Stack>
  );
}

export function CardDetail(props: TypographyProps) {
  const { children, ...other } = props;
  return (
    <Typography
      variant="caption"
      {...other}
      sx={[{
        color: "text.secondary"
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      {children}
    </Typography>
  );
}
