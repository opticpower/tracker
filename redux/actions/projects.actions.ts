import { AnyAction } from 'redux';

import { Label, Project } from '../types';

export const ADD_PROJECTS = 'ADD_PROJECTS';
export const ADD_LABEL = 'ADD_LABEL';

export const addProjects = (projects: Project[]): AnyAction => ({
  type: ADD_PROJECTS,
  projects,
});

export const addLabel = (projectId: string, label: Label): AnyAction => ({
  type: ADD_LABEL,
  projectId,
  label,
});
