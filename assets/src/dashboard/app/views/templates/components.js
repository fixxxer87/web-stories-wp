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
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Button } from '../../../components';

export const ContentContainer = styled.div`
  ${({ theme }) => `
    padding-top: ${theme.navBar.height + 40}px;
    margin: 0 ${theme.pageGutter.large.desktop}px;


    @media ${theme.breakpoint.tablet} {
      padding-top: ${theme.navBar.height + 20}px;
      margin: 0 ${theme.pageGutter.large.tablet}px;
    }

    @media ${theme.breakpoint.smallDisplayPhone} {
      margin: 0 ${theme.pageGutter.small.min}px;
    }
  `}
`;

export const ColumnContainer = styled.section`
  ${({ theme }) => `
    display: flex;
    margin-bottom: 40px;

    @media ${theme.breakpoint.largeDisplayPhone} {
      display: block;
    }
  `}
`;

export const DetailContainer = styled.div`
  width: 100%;
  padding: 40px 20px 0;
`;

export const Column = styled.div`
  ${({ theme }) => `
    display: flex;
    width: 50%;

    & + & {
      padding-left: ${theme.pageGutter.small.desktop}px;
    }

    @media ${theme.breakpoint.tablet} {
      & + & {
        padding-left: ${theme.pageGutter.small.min}px;
      }
    }

    @media ${theme.breakpoint.largeDisplayPhone} {
      width: 100%;
    }
  `}
`;

export const Title = styled.h2`
  ${({ theme }) => `
    margin: 0;
    font-family: ${theme.fonts.heading4.family};
    font-size: ${theme.fonts.heading4.size}px;
    font-weight: ${theme.fonts.heading4.weight};
    line-height: ${theme.fonts.heading4.lineHeight}px;
    color: ${theme.colors.gray900};
  `}
`;

export const ByLine = styled.p`
  ${({ theme }) => `
    margin: 0 0 20px;
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size}px;
    line-height: ${theme.fonts.body2.lineHeight}px;
    color: ${theme.colors.gray400};
  `}
`;

export const Text = styled.p`
  ${({ theme }) => `
    margin: 0 0 20px;
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size}px;
    line-height: ${theme.fonts.body2.lineHeight}px;
    letter-spacing: ${theme.fonts.body2.letterSpacing}em;
    color: ${theme.colors.gray900};
  `}
`;

export const MetadataContainer = styled.fieldset`
  > label {
    margin: 0 10px 14px 0;

    > span {
      display: flex;
      align-items: center;
      opacity: 1 !important;
    }
  }
`;

export const NavButton = styled(Button)`
  ${({ theme }) => `
    display: block;
    align-self: center;
    min-width: 0;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    color: ${theme.colors.gray600};
    background-color: transparent;
    border: ${theme.borders.transparent};
    transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

    &:hover, &:active, &:focus {
      background-color: ${theme.colors.gray600};
      color: ${theme.colors.white};
      @media ${theme.breakpoint.largeDisplayPhone} {
        color: ${theme.colors.gray900};
        background-color: transparent;
       }
    }
  `}
`;

export const RowContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;
  margin: 0 20px 0;
`;

export const SubHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading3.family};
  font-size: ${({ theme }) => theme.fonts.heading3.size}px;
  line-height: ${({ theme }) => theme.fonts.heading3.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.fonts.heading3.letterSpacing}em;
  font-weight: 500;
  margin: 0 0 20px 0;
`;

export const LargeDisplayPagination = styled.div(
  ({ theme }) => `
    display: flex;
    @media ${theme.breakpoint.largeDisplayPhone} {
      display: none;
    }
  `
);

export const SmallDisplayPagination = styled.div(
  ({ theme }) => `
    display: none;
    @media ${theme.breakpoint.largeDisplayPhone} {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      margin: 0 0 10px;
    }
  `
);
