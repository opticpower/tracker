import { AnyAction } from 'redux';

import { SET_USER } from '../actions/user.actions';
import { User } from '../types';

const initialState = {};

const reducer = (state: User = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_USER:
      return { ...action.user };

    default:
      return state;
  }
};

export default reducer;
