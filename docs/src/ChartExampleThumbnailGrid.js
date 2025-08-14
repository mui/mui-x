import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';

export function ChartThumbnailCard({ title, link, ChartComponent }) {
  return (
    <Link
      href={link}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        width: '100%',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '10px',
          border: 2,
          borderColor: 'secondary.main',
          borderRadius: 1,
          overflow: 'hidden',
          opacity: 0.7,
          backgroundColor: 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: '60%',
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
              '& > div': {
                width: '100% !important',
                height: '100% !important',
                minHeight: 'unset !important',
              },
              '& svg': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
              pointerEvents: 'none',
            }}
          >
            <ChartComponent />
          </Box>
        </Box>

        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            fontFamily={'IBM Plex Sans'}
            fontWeight="bold"
            variant="body1"
            color="text.primary"
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
}

ChartThumbnailCard.propTypes = {
  ChartComponent: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
