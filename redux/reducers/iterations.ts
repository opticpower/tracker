import { Iteration } from '../types';
import { AnyAction } from 'redux';
import { ADD_ITERATIONS } from '../actions/iterations.actions';

const initialState = {};

const reducer = (state: Record<number, Set<Iteration>> = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_ITERATIONS:
      const byProject = action.iterations.reduce(
        (totalByProject: Record<number, Set<Iteration>>, iteration: Iteration) => {
          const projectId = iteration.project_id;
          const iterations = totalByProject[projectId] || new Set();
          totalByProject[projectId] = iterations.add(iteration);
          return totalByProject;
        },
        {}
      );

      //todo: merge with whats in existing state instead of overwrite.
      return { ...state, ...byProject };
    default:
      return state;
  }
};

export default reducer;
