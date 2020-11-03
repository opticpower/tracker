import { AnyAction } from 'redux';

import { ADD_LABEL, ADD_PROJECTS } from '../actions/projects.actions';
import { Project } from '../types';

const initialState = [];

const reducer = (state: Project[] = initialState, action: AnyAction): Project[] => {
  switch (action.type) {
    case ADD_PROJECTS:
      return [
        ...action.projects.map(project => ({
          id: project.id,
          name: project.name,
          people: project.memberships.map(membership => membership.person),
          review_types: project.review_types,
          labels: project.labels,
        })),
      ];
    case ADD_LABEL: {
      return [
        ...state.map(project => ({
          ...project,
          labels: [...project.labels, action.label],
        })),
      ];
    }
    default:
      return state;
  }
};

export default reducer;
