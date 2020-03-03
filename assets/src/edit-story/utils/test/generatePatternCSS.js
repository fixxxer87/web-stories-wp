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
 * Internal dependencies
 */
import generatePatternCSS from '../generatePatternCSS';

describe('generatePatternCSS', () => {
  describe('given null', () => {
    it('should return transparent', () => {
      expect(generatePatternCSS(null)).toBe('background: transparent');
    });
  });

  describe('given an unknown type', () => {
    it('should throw error', () => {
      expect(() => generatePatternCSS({ type: 'comic' })).toThrow(
        /unknown pattern type/i
      );
    });
  });

  describe('given a color', () => {
    it('should return shortest form if possible', () => {
      expect(generatePatternCSS({ color: { r: 255, g: 0, b: 0 } })).toBe(
        'background-color: #f00'
      );
    });

    it('should return short form', () => {
      expect(generatePatternCSS({ color: { r: 254, g: 0, b: 0, a: 1 } })).toBe(
        'background-color: #fe0000'
      );
    });

    it('should return rgba if transparent', () => {
      expect(
        generatePatternCSS({ color: { r: 255, g: 0, b: 0, a: 0.7 } })
      ).toBe('background-color: rgba(255,0,0,0.7)');
    });

    it('should be able to render non-background properties', () => {
      expect(
        generatePatternCSS({ color: { r: 255, g: 0, b: 0 } }, 'fill')
      ).toBe('fill: #f00');
    });
  });

  describe('given any gradient', () => {
    it('should not be able to render non-background properties', () => {
      expect(() =>
        generatePatternCSS(
          {
            type: 'linear',
            stops: [
              { color: { r: 255, g: 0, b: 0 }, position: 0.3 },
              { color: { r: 0, g: 0, b: 255 }, position: 0.7 },
            ],
          },
          'fill'
        )
      ).toThrow(/only generate solid/i);
    });
  });

  describe('given a linear gradient', () => {
    it('should be able to render a two-stop gradient', () => {
      expect(
        generatePatternCSS({
          type: 'linear',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toBe('background-image: linear-gradient(#f00 0%, #00f 100%)');
    });

    it('should be able to render a multi-stop gradient with transparencies at an angle', () => {
      expect(
        generatePatternCSS({
          type: 'linear',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          rotation: 0.25,
        })
      ).toBe(
        'background-image: linear-gradient(0.25turn, rgba(255,0,0,0) 0%, #f00 60%, #00f 100%)'
      );
    });
  });

  describe('given a conic gradient', () => {
    it('should be able to render a two-stop gradient', () => {
      expect(
        generatePatternCSS({
          type: 'conic',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toBe('background-image: conic-gradient(#f00 0turn, #00f 1turn)');
    });

    it('should be able to render a multi-stop gradient', () => {
      expect(
        generatePatternCSS({
          type: 'conic',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toBe(
        'background-image: conic-gradient(rgba(255,0,0,0) 0turn, #f00 0.6turn, #00f 1turn)'
      );
    });

    it('should be able to render at an angle', () => {
      expect(
        generatePatternCSS({
          type: 'conic',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          rotation: 0.25,
        })
      ).toBe(
        'background-image: conic-gradient(from 0.25turn, #f00 0turn, #00f 1turn)'
      );
    });

    it('should be able to render off-center', () => {
      expect(
        generatePatternCSS({
          type: 'conic',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          center: { x: 0.4, y: 0.6 },
        })
      ).toBe(
        'background-image: conic-gradient(at 40% 60%, #f00 0turn, #00f 1turn)'
      );
    });

    it('should be able to at an angle *and* off-center', () => {
      expect(
        generatePatternCSS({
          type: 'conic',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          rotation: 0.25,
          center: { x: 0.4, y: 0.6 },
        })
      ).toBe(
        'background-image: conic-gradient(from 0.25turn at 40% 60%, #f00 0turn, #00f 1turn)'
      );
    });
  });

  describe('given a radial gradient', () => {
    it('should be able to render a two-stop gradient', () => {
      expect(
        generatePatternCSS({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toBe('background-image: radial-gradient(#f00 0%, #00f 100%)');
    });

    it('should be able to render a multi-stop gradient', () => {
      expect(
        generatePatternCSS({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toBe(
        'background-image: radial-gradient(rgba(255,0,0,0) 0%, #f00 60%, #00f 100%)'
      );
    });

    it('should be able to render different size', () => {
      expect(
        generatePatternCSS({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          size: { w: 0.2, h: 0.45678 },
        })
      ).toBe(
        'background-image: radial-gradient(ellipse 20% 45.68%, #f00 0%, #00f 100%)'
      );
    });

    it('should be able to render off-center', () => {
      expect(
        generatePatternCSS({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          center: { x: 0.4, y: 0.6 },
        })
      ).toBe(
        'background-image: radial-gradient(at 40% 60%, #f00 0%, #00f 100%)'
      );
    });

    it('should be able to different size *and* off-center', () => {
      expect(
        generatePatternCSS({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          size: { w: 0.2, h: 0.45678 },
          center: { x: 0.4, y: 0.6 },
        })
      ).toBe(
        'background-image: radial-gradient(ellipse 20% 45.68% at 40% 60%, #f00 0%, #00f 100%)'
      );
    });
  });
});