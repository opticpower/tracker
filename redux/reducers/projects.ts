import { AnyAction } from 'redux';

import { ADD_PROJECTS } from '../actions/projects.actions';
import { Project } from '../types';

const initialState = [];

const reducer = (state: Project[] = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_PROJECTS:
      return [
        ...action.projects.map(project => ({
          id: project.id,
          name: project.name,
          people: project.memberships.map(membership => membership.person),
          labels: project.labels,
        })),
      ];
    default:
      return state;
  }
};

export default reducer;
