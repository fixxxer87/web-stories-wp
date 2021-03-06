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
import { fireEvent, getByRole } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import ConfigContext from '../../../app/config/context';
import Buttons from '../buttons';
import { renderWithTheme } from '../../../testUtils';

function setupButtons(extraStoryProps, extraMetaProps) {
  const saveStory = jest.fn();
  const autoSave = jest.fn();

  const storyContextValue = {
    state: {
      meta: { isSaving: false, ...extraMetaProps },
      story: { status: 'draft', storyId: 123, date: null, ...extraStoryProps },
    },
    actions: { saveStory, autoSave },
  };
  const configValue = {
    previewLink:
      'https://example.com?preview_id=1679&preview_nonce=b5ea827939&preview=true',
  };
  const { getByText, container } = renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <StoryContext.Provider value={storyContextValue}>
        <Buttons />
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    container,
    getByText,
    autoSave,
    saveStory,
  };
}

describe('buttons', () => {
  const FUTURE_DATE = '9999-01-01T20:20:20';
  const PREVIEW_POPUP = {
    document: {
      write: jest.fn(),
    },
    location: {
      href: 'about:blank',
      replace: jest.fn(),
    },
  };

  it('should display Publish button when in draft mode', () => {
    const { getByText } = setupButtons();
    const publishButton = getByText('Publish');
    expect(publishButton).toBeDefined();
  });

  it('should update window location when publishing', () => {
    const { getByText, saveStory } = setupButtons();
    const publishButton = getByText('Publish');

    fireEvent.click(publishButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
    expect(window.location.href).toContain('post=123&action=edit');
  });

  it('should display Switch to draft button when published', () => {
    const { getByText, saveStory } = setupButtons({ status: 'publish' });
    const draftButton = getByText('Switch to Draft');

    expect(draftButton).toBeDefined();
    fireEvent.click(draftButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button when future date is set', () => {
    const { getByText, saveStory } = setupButtons({
      status: 'draft',
      date: FUTURE_DATE,
    });
    const scheduleButton = getByText('Schedule');

    expect(scheduleButton).toBeDefined();
    fireEvent.click(scheduleButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button with future status', () => {
    const { getByText } = setupButtons({
      status: 'future',
      date: FUTURE_DATE,
    });
    const scheduleButton = getByText('Schedule');

    expect(scheduleButton).toBeDefined();
  });

  it('should display loading indicator while the story is updating', () => {
    const { container } = setupButtons({}, { isSaving: true });
    expect(getByRole(container, 'progressbar')).toBeInTheDocument();
  });

  it('should open draft preview when clicking on Preview via about:blank', () => {
    const { getByText, saveStory } = setupButtons({
      link: 'https://example.com',
    });
    const previewButton = getByText('Preview');

    expect(previewButton).toBeDefined();

    saveStory.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn();
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      open: mockedOpen,
    }));

    const popup = PREVIEW_POPUP;
    mockedOpen.mockImplementation(() => popup);

    fireEvent.click(previewButton);

    expect(saveStory).toHaveBeenCalledWith();
    expect(mockedOpen).toHaveBeenCalledWith('about:blank', 'story-preview');
    expect(popup.location.replace).toHaveBeenCalledWith(
      'https://example.com/?preview=true'
    );

    windowSpy.mockRestore();
  });

  it('should open preview for a published story when clicking on Preview via about:blank', () => {
    const { getByText, autoSave } = setupButtons({
      link: 'https://example.com',
      status: 'publish',
    });
    const previewButton = getByText('Preview');
    autoSave.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn();
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      open: mockedOpen,
    }));

    const popup = PREVIEW_POPUP;
    mockedOpen.mockImplementation(() => popup);

    fireEvent.click(previewButton);

    expect(autoSave).toHaveBeenCalledWith();
    expect(popup.location.replace).toHaveBeenCalledWith(
      'https://example.com?preview_id=1679&preview_nonce=b5ea827939&preview=true'
    );

    windowSpy.mockRestore();
  });
});
