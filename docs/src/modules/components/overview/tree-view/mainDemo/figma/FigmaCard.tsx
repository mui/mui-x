/* eslint-disable material-ui/no-hardcoded-labels
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IdType } from './items';

const CustomCard = styled(Card)({
  overflow: 'visible',
  '&.selectedItem': {
    outline: '2px solid hsl(269, 100%, 57%)',
    outlineOffset: '-2px',
  },
  '& .selectedItem': {
    outline: '2px solid hsl(269, 100%, 57%)',
    outlineOffset: '-2px',
  },
});

export default function FigmaCard({ selectedItem }: { selectedItem: IdType | null }) {
  return (
    <CustomCard sx={{ maxWidth: 345 }} className={selectedItem === 'paper' ? 'selectedItem' : ''}>
      <CardHeader
        className={selectedItem === 'header' ? 'selectedItem' : ''}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            className={selectedItem === 'avatar' ? 'selectedItem' : ''}
          >
            <Typography
              variant="body1"
              sx={{ color: 'white' }}
              className={selectedItem === 'avatar_initial' ? 'selectedItem' : ''}
            >
              R
            </Typography>
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            className={selectedItem === 'action_button' ? 'selectedItem' : ''}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography
            variant="body2"
            className={selectedItem === 'header_title' ? 'selectedItem' : ''}
          >
            Shrimp and Chorizo Paella
          </Typography>
        }
        subheader={
          <Typography
            variant="caption"
            className={selectedItem === 'header_caption' ? 'selectedItem' : ''}
          >
            September 14, 2016
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image="/static/x/overview/paella.jpg"
        alt="Paella dish"
        className={selectedItem === 'media' ? 'selectedItem' : ''}
      />
      <CardContent className={selectedItem === 'content' ? 'selectedItem' : ''}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
          className={selectedItem === 'text_content' ? 'selectedItem' : ''}
        >
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={selectedItem === 'actions' ? 'selectedItem' : ''}>
        <IconButton
          aria-label="add to favorites"
          className={selectedItem === 'favorite' ? 'selectedItem' : ''}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" className={selectedItem === 'share' ? 'selectedItem' : ''}>
          <ShareIcon />
        </IconButton>
      </CardActions>
    </CustomCard>
  );
}
