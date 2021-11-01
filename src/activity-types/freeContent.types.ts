import type { Activity } from 'types/activity.type';

export type FreeContentData = {
  title: string;
  resume: string;
  isPinned: boolean;
};

export type FreeContentActivity = Activity<FreeContentData>;
