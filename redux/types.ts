export interface State {
  projects?: Project[];
  stories?: Record<string, Record<string, Story[]>>;
  iterations?: Record<number, Set<Iteration>>;
  settings?: Settings;
}

export interface Project {
  id: string;
  name: string;
}

export interface Story {
  id: string;
  name: string;
  story_type: string;
  estimate: number;
  owners: Owner[];
  labels: Label[];
  blockers: Blocker[];
  comments: Comment[];
  description: string;
  current_state?: string;
}

export interface Owner {
  id: string;
  name: string;
  initials: string;
}

export interface Label {
  id: string;
  name: string;
}

export interface Blocker {
  id: number;
  kind: string;
  story_id: string;
  description: string;
}

export interface Comment {
  id: number;
  person: Owner;
  text: string;
  created_at: string;
}

export interface Filters {
  labels?: Label[];
  owners?: Owner[];
  iteration?: Iteration;
}

export interface Iteration {
  project_id?: number;
  number: number;
  length: number;
  stories: Story[];
  start: string;
  finish: string;
}

export interface UrlParams {
  id?: string;
  story?: string;
}

export interface Settings {
  theme: string;
  apiKey?: string;
}
