export interface State {
  projects?: Project[];
  stories?: Record<string, Record<string, Story[]>>;
  iterations?: Record<number, Set<Iteration>>;
  settings?: Settings;
  selectedStory?: SelectedStory;
}

export interface Project {
  id: string;
  name: string;
}

export interface SelectedStory {
  story?: Story;
  selected: boolean;
}

export interface Story {
  id: string;
  name: string;
  story_type: string;
  estimate: number;
  owners: Owner[];
  labels: Label[];
  blockers: Blocker[];
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

export interface Blocker {
  id: number;
  kind: string;
  story_id: string;
  description: string;
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
