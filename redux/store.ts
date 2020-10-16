// store.ts
import { Context, createWrapper, MakeStore } from 'next-redux-wrapper';
import { AnyAction, combineReducers, createStore } from 'redux';

import iterations from './reducers/iterations';
import projects from './reducers/projects';
import settings from './reducers/settings';
import stories from './reducers/stories';
import { State } from './types';

const makeStore: MakeStore<State> = (context: Context) =>
  createStore(
    combineReducers({
      projects,
      stories,
      iterations,
      settings,
    })
  );

export const wrapper = createWrapper<State>(makeStore, { debug: true });
