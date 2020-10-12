import { AnyAction } from 'redux';

export const SET_THEME = 'SET_THEME';
export const SET_API_KEY = 'SET_API_KEY';

export const setTheme = (theme: string): AnyAction => ({
  type: SET_THEME,
  theme,
});

export const setApiKey = (apiKey: string): AnyAction => ({
  type: SET_API_KEY,
  apiKey,
});
