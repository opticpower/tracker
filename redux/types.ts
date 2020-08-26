export interface State {
  projects?: Project[];
  stories?: Record<string, Record<string, Story[]>>;
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
}
