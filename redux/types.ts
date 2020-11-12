export interface State {
  projects?: Project[];
  stories?: StoriesState;
  iterations?: Record<number, Set<Iteration>>;
  settings?: Settings;
  selectedStory: SelectedStory;
  user?: User;
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

export enum StoryModes {
  State = 'State',
  Milestone = 'Milestone',
}

export interface StoriesByProject {
  selectedMode: StoryModes;
  storyIdsByState: Record<string, string[]>;
  storyIdsByMilestone: Record<string, string[]>;
}

export interface Project {
  id: string;
  name: string;
  people: Owner[];
  review_types: ReviewType[];
  labels: Label[];
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
  reviews: Review[];
  blocked_story_ids?: number[];
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
  resolved: boolean;
}

export interface Comment {
  id: number;
  person: Owner;
  text: string;
  created_at: string;
  attachments: AttachmentFile[];
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

export interface User {
  email?: string;
  id?: number;
  initials?: string;
  name?: string;
}

export interface Review {
  id?: number;
  creation_id?: number;
  reviewer_id?: number;
  story_id: number;
  review_type_id: number;
  status: string;
}

export interface ReviewType {
  id?: number;
  name: string;
  hidden: boolean;
}
export interface ReviewTypesObj {
  [key: number]: ReviewType;
}

export interface ReviewComment {
  review_id: number;
  text: string;
}

export interface AttachmentFile {
  id: number;
  big_url: string;
  download_url: string;
  filename: string;
  height: number;
  thumbnail_url: string;
  thumbnailable: boolean;
  width: number;
}
