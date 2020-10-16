export interface State {
  projects?: Project[];
  stories?: StoriesState;
  iterations?: Record<number, Set<Iteration>>;
  settings?: Settings;
  selectedStory: SelectedStory;
}

export interface SelectedStory {
  storyId?: string;
  selected: boolean;
}

export interface StoriesState {
  byId: Record<string, Story>;
  byProject: Record<string, StoriesByProject>;
  selectedStoryId?: string;
  selectedProjectId?: string;
}

export interface StoriesByProject {
  storyIdsByState: Record<string, string[]>;
  // storyIdsByMilestone: Record<string, string[]>;
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
}

export interface Settings {
  theme: string;
  apiKey?: string;
}
