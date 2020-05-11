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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { MASKS } from '../../../../masks';
import { Section, SearchInput } from '../../common';
import { Pane } from '../shared';
import ShapePreview from './shapePreview';
import paneId from './paneId';

const SectionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -0.2em -1em 0.5em -1em;
`;

function ShapesPane(props) {
  return (
    <Pane id={paneId} {...props}>
      <SearchInput
        value={''}
        placeholder={__('Search', 'web-stories')}
        onChange={() => {}}
        disabled
      />
      <Section title={__('Basic shapes', 'web-stories')}>
        <SectionContent>
          {/** Basic masks */}
          {MASKS.map((mask) => {
            return ShapePreview(mask);
          })}
        </SectionContent>
      </Section>
    </Pane>
  );
}

export default ShapesPane;
