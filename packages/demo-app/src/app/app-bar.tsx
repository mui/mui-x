import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles, Link, Theme } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import GitHubIcon from '@material-ui/icons/GitHub';
import { isIntroPage } from './utils';
import { useLocation } from 'react-router-dom';

const DemoAppBarStyled = styled(AppBar)`
  color: ${p => p.theme.colors.app};
  border-bottom: 1px solid ${p => p.theme.colors.app};
  background-color: ${p => p.theme.colors.background};

  .title {
    flex-grow: 1;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: 300;
    margin-left: -12px;
    text-indent: 0.7rem;
    white-space: nowrap;
    letter-spacing: 0.3rem;
  }
  .product-title {
    margin-left: 10px;
    color: ${p => p.theme.colors.secondApp};
    font-weight: 400;
  }
`;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
  });
});

export interface DemoAppBarProps {
  onMenuButtonClick: () => void;
  onThemeToggle: () => void;
  isDark: boolean;
}

export const DemoAppBar: React.FC<DemoAppBarProps> = ({ onMenuButtonClick, onThemeToggle, isDark }) => {
  const classes = useStyles();
  const location = useLocation();
  const [hideTitle, setHideTitle] = useState(false);

  useEffect(() => {
    const isIntro = isIntroPage();
    setHideTitle(isIntro);

  }, [location]);

  const titleEl: any = hideTitle ? null : (
    <>
      Material-UI<span className={'product-title'}>X</span>
    </>
  );

  return (
    <DemoAppBarStyled position="static" variant={'outlined'}>
      <Toolbar className={'toolbar'}>
        <IconButton
          onClick={onMenuButtonClick}
          onTouchStart={onMenuButtonClick}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h1" className={'title'}>
          {titleEl}
        </Typography>

        <Link href={'https://github.com/mui-org/material-ui-x'} className={'github-button'}>
          <Tooltip title="GitHub repository">
            <IconButton aria-label="Toggle Theme" color="primary">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Link>
        <div className={'theme-button'} onClick={onThemeToggle}>
          <Tooltip title="Toggle light/dark theme">
            <IconButton aria-label="Toggle Theme" color="primary">
              {isDark ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </DemoAppBarStyled>
  );
};
DemoAppBar.displayName = 'FinUiAppBar';
