// store.ts
import { createStore, AnyAction, combineReducers } from 'redux';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import { State } from './types';
import projects from './reducers/projects';

// create your reducer
const reducer = (state: State = {}, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// create a makeStore function
const makeStore: MakeStore<State> = (context: Context) =>
  createStore(
    combineReducers({
      reducer,
      projects,
    })
  );

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, { debug: true });
