import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CodeIcon from '@mui/icons-material/Code';
import Tooltip from '@mui/material/Tooltip';

export function ChartThumbnailCard({ title, ChartComponent, link, aspectRatio = '80%' }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        overflow: 'hidden',
        borderRadius: 0,
        borderWidth: 0.5,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontFamily={'IBM Plex Sans'} variant="body1" color="text.primary">
          {title}
        </Typography>
        {link && (
          <Tooltip title="View code">
            <IconButton
              component="a"
              href={link}
              rel="noopener noreferrer"
              size="small"
              sx={{
                width: 32,
                height: 32,
                border: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                color: 'primary.main',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 0,
          paddingBottom: aspectRatio,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            containerType: 'inline-size',
            '& > div': {
              width: '100%',
              height: '100%',
            },
            '& [data-hide-overview=true]': {
              display: 'none',
            },
          }}
        >
          <ChartComponent />
        </Box>
      </Box>
    </Paper>
  );
}

ChartThumbnailCard.propTypes = {
  ChartComponent: PropTypes.elementType.isRequired,
  aspectRatio: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export function ChartThumbnailGridWrapper({ children, ...props }) {
  return (
    <Paper
      component="div"
      variant="outlined"
      sx={{
        my: 4,
        overflow: 'hidden',
        background: 'background.paper',
        borderRadius: 0.5,
        borderWidth: 1,
        ...props.sx,
      }}
      {...props}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 0,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

ChartThumbnailGridWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
