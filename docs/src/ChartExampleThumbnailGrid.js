import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function ChartThumbnailCard({ title, ChartComponent }) {
  return (
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
        backgroundColor: 'background.paper',
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
  );
}

ChartThumbnailCard.propTypes = {
  ChartComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};
