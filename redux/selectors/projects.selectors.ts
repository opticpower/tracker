import { Label, Owner, ReviewTypesObj, State } from '../types';

export const getProjectName = (state: State, id: string): string => {
  return state.projects.find(project => String(project.id) === String(id))?.name;
};

export const getPeople = (state: State): Owner[] => {
  return state.projects.find(
    project => String(project.id) === String(state.stories?.selectedProjectId)
  )?.people;
};

export const getReviewTypes = (state: State, id: string): ReviewTypesObj => {
  return state.projects
    .find(project => String(project.id) === String(id))
    ?.review_types.reduce((prev, curr: any) => {
      prev[curr.id] = {
        name: curr.name,
        hidden: curr.hidden,
      };
      return prev;
    }, {});
};

export const getLabels = (state: State): Label[] => {
  return state.projects.find(
    project => String(project.id) === String(state.stories?.selectedProjectId)
  )?.labels;
};
