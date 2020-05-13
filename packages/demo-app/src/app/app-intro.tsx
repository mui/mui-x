import { MuiLogo } from './demos/grid/components/logo';
import Typography from '@material-ui/core/Typography';

import React from 'react';
import {Button, Container, Link} from '@material-ui/core';
import styled from 'styled-components';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const Splash = styled.div`
  display: flex;
  color: ${p => p.theme.colors.app};
  background-color: ${p => p.theme.colors.background};

  .splash-container {
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    padding-top: 32px;
    flex-direction: column;
    padding-bottom: 64px;
  }
  .logo {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    margin-bottom: 16px;
  }
  @media (min-width: 960px) {
    .splash-container {
      text-align: left;
      align-items: flex-start;
      padding-top: 128px;
      flex-direction: row;
      padding-bottom: 128px;
      max-width: 960px;
    }
    .logo {
      width: 195px;
      height: 175px;
      margin-right: 64px;
    }
  }
  @media (min-width: 600px) {
    .splash-container {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
  .title {
    flex-grow: 1;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 3rem;
    text-transform: uppercase;
    font-weight: 300;
    margin-left: -12px;
    text-indent: 0.7rem;
    white-space: nowrap;
    letter-spacing: 0.7rem;
    margin-bottom: 0.35em;
  }

  .intro {
    font-size: 1.5rem;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
    line-height: 1.334;
    letter-spacing: 0em;
  }

  .product-title {
    color: ${p => p.theme.colors.secondApp};
    font-size: 4rem;
    font-weight: 500;
  }
  .product-title-logo {
    color: ${p => p.theme.colors.secondApp};
    position: absolute;
    font-weight: 800;
    top: -22px;
    right: 47px;
    background: white;
    padding: 0;
    margin: 0;
    display: none;
  }
  .logo-container {
    position: relative;
  }
  .main-action-button {
    margin-top: 32px;
    border: 1px solid rgba(25, 118, 210, 0.5);
  }
`;

export const AppIntro: React.FC<{}> = () => {
  return (
    <Splash>
      <Container maxWidth="sm" className={'splash-container'}>
        <div className={'logo-container'}>
          <MuiLogo />
          <Typography variant="h1" className={'product-title-logo'}>
            X
          </Typography>
        </div>
        <div>
          <Typography variant="h1" className={'title'}>
            Material-UI <span className={'product-title'}>X</span>
          </Typography>
          <Typography component="h5" className={'intro'}>
            Extension with highly complex components for Startup and Enterprise projects.
          </Typography>
          <Button href={'#/grid'} variant={'outlined'} color={'primary'} className={'main-action-button'}>
            <KeyboardArrowRightIcon fontSize={'small'} /> Preview
          </Button>
        </div>
      </Container>
    </Splash>
  );
};
/*
* Build your own financial or
            trading application with this highly customisable and accessible toolkit.*/