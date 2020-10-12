import { State, Story } from '../types';

export const getApiKey = (state: State): string => {
  return state.settings?.apiKey;
};

export const getTheme = (state: State): string => {
  return state.settings?.theme || 'dark';
};
