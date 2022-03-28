import type { Activity } from 'types/activity.type';

export type AnthemData = {
  verseMix: Sample[];
  introOutro: Sample[];
  verse: Syllable[];
  chorus: Syllable[];
};

export type Syllable = {
  content: string;
  isBack: boolean;
}

export type Sample = {
  value: string;
  display: boolean;
  label: string;
  type: SampleType;
}

export enum SampleType {
  VOCALS = 0,
  HARMONIC1 = 1,
  HARMONIC2 = 2,
  MELODIC1 = 3,
  MELODIC2 = 4,
  RYTHMIC1 = 5,
  RYTHMIC2 = 6,
  INTRO_CHORUS = 7,
  OUTRO = 8
}

export type AnthemActivity = Activity<AnthemData>;
