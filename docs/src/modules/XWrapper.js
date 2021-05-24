import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  '@global': {
    '.pro, .premium': {
      display: 'inline-block',
      height: '1em',
      verticalAlign: 'middle',
      marginLeft: 2,
      marginRight: 2,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    '.pro': {
      width: `${24 / 18}em`,
      backgroundImage: 'url(/static/x/pro.svg)',
    },
    '.premium': {
      width: `${33 / 18}em`,
      backgroundImage: 'url(/static/x/premium.svg)',
    },
  },
});

export default function XWrapper(props) {
  useStyles();
  return props.children;
}
