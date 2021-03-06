import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from 'client/utils/hooks';

export const UserNavigation = (props: {
  onSelect: () => void;
}): ReactElement => {
  const { t } = useTranslation();
  const appOpen = useAppSelector((state) => state.admin.appOpen);

  return (
    <StyledRoutes>
      {appOpen && (
        <RouterLink
          onClick={props.onSelect}
          to='/games'
          data-testkey='all-games-page-link'
        >
          {t('pages.allGames')}
        </RouterLink>
      )}

      <RouterLink
        onClick={props.onSelect}
        to='/login'
        data-testkey='login-page-link'
      >
        {t('button.login')}
      </RouterLink>

      {appOpen && (
        <RouterLink
          onClick={props.onSelect}
          to='/registration'
          data-testkey='registration-page-link'
        >
          {t('button.register')}
        </RouterLink>
      )}
    </StyledRoutes>
  );
};

const RouterLink = styled(NavLink)`
  position: relative;
  display: inline-block;
  padding: 10px 12px 10px 12px;
  font-size: ${(props) => props.theme.linkFontSize};
  text-decoration: none;
  color: ${(props) => props.theme.mainText};
  border-bottom: 1px solid black;

  :hover,
  :focus,
  &.active {
    background: ${(props) => props.theme.backgroundHover};
  }
`;

const StyledRoutes = styled.div`
  display: flex;
  flex-direction: column;
`;
