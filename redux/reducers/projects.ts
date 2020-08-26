import { Project } from '../types';
import { AnyAction } from 'redux';
import { ADD_PROJECTS } from '../actions/projects.actions';

const initialState = [];

const reducer = (state: Project[] = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_PROJECTS:
      return [...action.projects];
    default:
      return state;
  }
};

export default reducer;
