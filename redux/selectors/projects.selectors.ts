import { Owner, State } from '../types';

export const getProjectName = (state: State, id: string): string => {
  return state.projects.find(project => String(project.id) === String(id))?.name;
};

export const getPeople = (state: State): Owner[] => {
  return state.projects.find(
    project => String(project.id) === String(state.stories?.selectedProjectId)
  )?.people;
};
