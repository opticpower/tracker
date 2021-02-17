import { Label, Owner, ReviewTypesObj, State } from '../types';

export const getProjectName = (state: State, id: string): string => {
  return state.projects.find(project => String(project.id) === String(id))?.name;
};

export const getPeople = (state: State, ids?: number[]): Owner[] => {
  const people = state.projects.find(
    project => String(project.id) === String(state.stories?.selectedProjectId)
  )?.people;

  if (ids?.length) {
    return people?.filter(person => ids.includes(Number(person.id))) || [];
  } else {
    return people;
  }
};

export const getReviewTypes = (state: State, id: string): ReviewTypesObj => {
  return (
    state.projects
      .find(project => String(project.id) === String(id))
      ?.review_types.reduce((prev, curr) => {
        prev[curr.id] = {
          name: curr.name,
          hidden: curr.hidden,
        };
        return prev;
      }, {}) || {}
  );
};

export const getLabels = (state: State): Label[] => {
  return state.projects.find(
    project => String(project.id) === String(state.stories?.selectedProjectId)
  )?.labels;
};
