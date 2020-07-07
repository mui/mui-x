import Link from '@material-ui/core/Link';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import * as React from 'react';

import styled from 'styled-components';

interface AppBreadcrumbsProps {
  name: string;
}

const StyledBreadcrumbs = styled(Breadcrumbs)`
  background-color: ${p => p.theme.colors.breadcrumbsBg};
  color: ${p => p.theme.colors.breadcrumbsTitle} !important;
  border-bottom: 1px solid ${p => p.theme.colors.breadcrumbsBorderBottom};
  line-height: 36px;
  height: 36px;

  a {
    line-height: 36px;
    padding: 5px;
    font-size: 12px;
    font-weight: 600;
    color: ${p => p.theme.colors.breadcrumbsTitle};
  }

  .current {
    color: ${p => p.theme.colors.breadcrumbsTitleCurrent};
  }
`;

export function AppBreadcrumbs({ name }: AppBreadcrumbsProps) {
  return (
    <StyledBreadcrumbs separator="›" aria-label="breadcrumb">
      <Link color="inherit" href="#">
        Home
      </Link>
      <Link color="inherit" href="#">
        Components Showcase
      </Link>
      <Link color="textPrimary" className={'current'}>
        {name}
      </Link>
    </StyledBreadcrumbs>
  );
}
