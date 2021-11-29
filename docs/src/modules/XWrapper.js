import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  '@global': {
    '.plan-pro, .plan-premium': {
      display: 'inline-block',
      height: '1em',
      width: '1em',
      verticalAlign: 'middle',
      marginLeft: '0.13em',
      marginBottom: '0.13em',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    '.plan-pro': {
      backgroundImage: 'url(/static/x/pro.svg)',
    },
    '.plan-premium': {
      backgroundImage: 'url(/static/x/premium.svg)',
    },
  },
});

export default function XWrapper(props) {
  useStyles();
  return props.children;
}
