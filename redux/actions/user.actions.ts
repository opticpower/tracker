import { AnyAction } from 'redux';

import { User } from '../types';

export const SET_USER = 'SET_USER';

export const setUser = (user: User): AnyAction => ({
  type: SET_USER,
  user,
});
