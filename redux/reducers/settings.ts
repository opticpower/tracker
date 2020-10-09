import { Settings } from '../types';
import { AnyAction } from 'redux';
import { SET_THEME, SET_API_KEY } from '../actions/settings.actions';
import { setCookie } from 'nookies';
import { HYDRATE } from 'next-redux-wrapper';

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
