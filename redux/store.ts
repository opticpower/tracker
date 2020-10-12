// store.ts
import { createStore, AnyAction, combineReducers } from 'redux';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';
import { State } from './types';
import projects from './reducers/projects';
import stories from './reducers/stories';
import iterations from './reducers/iterations';
import settings from './reducers/settings';

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
