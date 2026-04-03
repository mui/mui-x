import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function Card(props) {
  const { children, ...other } = props;
  return (
    <Stack
      direction="row"
      {...other}
      sx={[
        {
          gap: 2,
          alignItems: 'center',
          width: '100%',
          height: '100%',
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {children}
    </Stack>
  );
}

export function CardMedia(props) {
  const { children, ...other } = props;
  return (
    <Stack
      {...other}
      sx={[
        { flexShrink: 0, alignItems: 'center' },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {children}
    </Stack>
  );
}

export function CardContent(props) {
  const { children, ...other } = props;
  return (
    <Stack
      {...other}
      sx={[
        {
          gap: 0.25,
          flexGrow: 1,
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {children}
    </Stack>
  );
}

export function CardTitle(props) {
  const { children, ...other } = props;
  return (
    <Typography variant="body2" {...other}>
      {children}
    </Typography>
  );
}

export function CardDetailList(props) {
  const { children, ...other } = props;
  return (
    <Stack
      direction="row"
      {...other}
      sx={[
        {
          flexWrap: 'wrap',
          gap: 1,
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {children}
    </Stack>
  );
}

export function CardDetail(props) {
  const { children, ...other } = props;
  return (
    <Typography
      variant="caption"
      {...other}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {children}
    </Typography>
  );
}
