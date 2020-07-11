import * as React from 'react';
import Interpolate from '@trendmicro/react-interpolate';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      marginTop: 20,
    },
    section: {
      color: theme.palette.secondary.contrastText,
    },
    footer: {
      padding: 0,
      [theme.breakpoints.up('sm')]: {
        padding: '15px 0',
      },
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(4),
      '& img': {
        width: 28,
        height: 22,
        marginRight: theme.spacing(1.5),
      },
    },
    list: {
      marginBottom: theme.spacing(4),
      '& h3': {
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& ul': {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      '& li': {
        padding: '6px 0',
        color: theme.palette.text.secondary,
      },
    },
    version: {
      marginTop: theme.spacing(3),
    },
  });
});

function AppFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Divider />
      <Container maxWidth="md">
        <footer className={classes.footer}>
          <Grid container>
            <Grid item xs={12} sm={3}>
              <div className={classes.logo}>
                <img src="/mui-logo_raw.svg" alt="" />
                <Link
                  className={classes.section}
                  variant="body1"
                  color="inherit"
                  href="https://material-ui.com"
                >
                  Material-UI
                </Link>
              </div>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom className={classes.section}>
                Community
              </Typography>
              <ul>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://github.com/mui-org/material-ui"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link color="inherit" variant="body2" href="https://twitter.com/MaterialUI">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://stackoverflow.com/questions/tagged/material-ui"
                  >
                    StackOverflow
                  </Link>
                </li>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://material-ui.com/discover-more/team/"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom className={classes.section}>
                Resources
              </Typography>
              <ul>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://material-ui.com/getting-started/support/"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link color="inherit" variant="body2" href="https://medium.com/material-ui/">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://material-ui.com/components/material-icons/"
                  >
                    Material Icons
                  </Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={3} className={classes.list}>
              <Typography component="h2" gutterBottom className={classes.section}>
                Company
              </Typography>
              <ul>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://material-ui.com/company/about/"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    color="inherit"
                    variant="body2"
                    href="https://material-ui.com/company/contact/"
                  >
                    Contact Us
                  </Link>
                </li>
                {/*
                <li>
                  <Link color="inherit" variant="body2" href="/company/jobs/">
                    Jobs
                  </Link>
                </li>
                */}
              </ul>
            </Grid>
          </Grid>
          <Typography className={classes.version} color="textSecondary" variant="body2">
            <Interpolate
              replacement={{
                versionNumber: (
                  <Link
                    color="inherit"
                    href="https://material-ui.com/versions/"
                    aria-label={`v4.9.14. View versions page.`}
                  >
                    v4.9.14
                  </Link>
                ),
                license: (
                  <Link
                    color="inherit"
                    href="https://github.com/mui-org/material-ui/blob/master/LICENSE"
                  >
                    MIT
                  </Link>
                ),
              }}
            >
              {'Currently {{versionNumber}}. Released under the {{license}} License.'}
            </Interpolate>
            {' Copyright © '}
            {new Date().getFullYear()}
            {' Material-UI. '}
          </Typography>
        </footer>
      </Container>
    </div>
  );
}

export default AppFooter;
