import { Project } from '../types';
import { AnyAction } from 'redux';

export const ADD_PROJECTS = 'ADD_PROJECTS';

export const addProjects = (projects: Project[]): AnyAction => ({
  type: ADD_PROJECTS,
  projects,
});
