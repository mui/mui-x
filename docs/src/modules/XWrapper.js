import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  '@global': {
    '.pro, .premium': {
      display: 'inline-block',
      height: '1em',
      width: '1em',
      verticalAlign: 'middle',
      marginLeft: 2,
      marginRight: 2,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    '.pro': {
      backgroundImage: 'url(/static/x/pro.svg)',
    },
    '.premium': {
      backgroundImage: 'url(/static/x/premium.svg)',
    },
  },
});

export default function XWrapper(props) {
  useStyles();
  return props.children;
}
