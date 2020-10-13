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
  description: string;
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

export interface Settings {
  theme: string;
  apiKey?: string;
}
