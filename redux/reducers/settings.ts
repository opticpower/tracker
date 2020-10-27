import { HYDRATE } from 'next-redux-wrapper';
import { setCookie } from 'nookies';
import { AnyAction } from 'redux';

import { SET_API_KEY, SET_THEME } from '../actions/settings.actions';
import { Settings } from '../types';

const initialState = {
  theme: 'dark',
};

const reducer = (state: Settings = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      //this populates settings from cookies
      return { ...action.payload.settings };
    case SET_THEME:
      setCookie(null, 'theme', action.theme, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      return { ...state, theme: action.theme };
    case SET_API_KEY:
      setCookie(null, 'apiKey', action.apiKey, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      return { ...state, apiKey: action.apiKey };
    default:
      return state;
  }
};

export default reducer;
