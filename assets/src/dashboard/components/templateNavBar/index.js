/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { BUTTON_TYPES } from '../../constants';
import { BookmarkChip, Button } from '../../components';
import { parentRoute } from '../../app/router/route';

const Nav = styled.nav`
  ${({ theme }) => `
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${theme.borders.gray50};
  background-color: ${theme.colors.white};
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${theme.navBar.height}px;

  padding: 0 ${theme.pageGutter.large.desktop}px;

  @media ${theme.breakpoint.tablet} {
    padding: 0 ${theme.pageGutter.large.tablet}px;
  }

  @media ${theme.breakpoint.smallDisplayPhone} {
    flex-wrap: wrap;
    padding: 0 ${theme.pageGutter.small.min}px;
  }
  `}
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const BookmarkToggle = styled(BookmarkChip)`
  margin-right: 10px;
`;

const CloseLink = styled.a`
  ${({ theme }) => `
    font-family: ${theme.fonts.body1.family};
    font-size: ${theme.fonts.body1.size}px;
    font-weight: ${theme.fonts.body1.weight};
    line-height: ${theme.fonts.body1.lineHeight}px;
    letter-spacing: ${theme.fonts.body1.letterSpacing}em;
    text-decoration: none;
    color: ${theme.colors.gray700};
  `}
`;

export function TemplateNavBar() {
  return (
    <Nav>
      <Container>
        <CloseLink href={parentRoute()}>{__('Close', 'web-stories')}</CloseLink>
      </Container>
      <Container>
        <BookmarkToggle />
        <Button type={BUTTON_TYPES.CTA} href={'#'} isLink={true}>
          {__('USE TEMPLATE', 'web-stories')}
        </Button>
      </Container>
    </Nav>
  );
}
