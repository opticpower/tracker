// store.ts
import { Context, createWrapper, MakeStore } from 'next-redux-wrapper';
import { combineReducers, createStore } from 'redux';

import iterations from './reducers/iterations';
import projects from './reducers/projects';
import selectedStory from './reducers/selectedStory';
import settings from './reducers/settings';
import stories from './reducers/stories';
import { State } from './types';

const makeStore: MakeStore<State> = (context: Context) => {
  const ext =
    typeof window !== 'undefined' &&
    window['__REDUX_DEVTOOLS_EXTENSION__'] &&
    window['__REDUX_DEVTOOLS_EXTENSION__']();
  return createStore(
    combineReducers({
      projects,
      stories,
      iterations,
      settings,
      selectedStory,
    }),
    ext
  );
};

export const wrapper = createWrapper<State>(makeStore, { debug: true });
