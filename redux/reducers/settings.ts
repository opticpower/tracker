import { Settings } from '../types';
import { AnyAction } from 'redux';
import { CHANGE_THEME, SET_API_KEY } from '../actions/settings.actions';

const initialState = {
  theme: 'dark',
};

const reducer = (state: Settings = initialState, action: AnyAction) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, theme: action.theme };
    case SET_API_KEY:
      return { ...state, apiKey: action.apiKey };
    default:
      return state;
  }
};

export default reducer;
