// store.ts
import { createStore, AnyAction, combineReducers } from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { State } from './types';
import projects from './reducers/projects';
import stories from './reducers/stories';
import iterations from './reducers/iterations';
import settings from './reducers/settings';

const reducer = (
  state: State = {
    settings: {
      theme: 'dark',
    },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const makeStore: MakeStore<State> = (context: Context) =>
  createStore(
    combineReducers({
      reducer,
      projects,
      stories,
      iterations,
      settings,
    })
  );

export const wrapper = createWrapper<State>(makeStore, { debug: true });
