import { AnyAction } from 'redux';

export const CHANGE_THEME = 'CHANGE_THEME';
export const SET_API_KEY = 'SET_API_KEY';

export const changeTheme = (theme: string): AnyAction => ({
  type: CHANGE_THEME,
  theme,
});

export const setApiKey = (apiKey: string): AnyAction => ({
  type: SET_API_KEY,
  apiKey,
});
