import Link from '@material-ui/core/Link';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import React from 'react';

import styled from 'styled-components';

interface AppBreadcrumbsProps {
  name: string;
}

const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 5px;
  font-size: 12px;
  line-height: 25px;
  background-color: ${p => p.theme.colors.breadcrumbsBg};
  font-weight: 600;
  border-bottom: 1px solid ${p => p.theme.colors.breadcrumbsBorderBottom};
  color: ${p => p.theme.colors.breadcrumbsTitle};

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
