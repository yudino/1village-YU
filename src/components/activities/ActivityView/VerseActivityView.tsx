import React from 'react';

import type { VerseRecordActivity } from 'src/activity-types/verseRecord.types';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { bgPage } from 'src/styles/variables.const';

import type { ActivityViewProps } from './activity-view.types';

export const VerseActivityView = ({ activity }: ActivityViewProps<VerseRecordActivity>) => {
  return (
    <div>
      <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>Voilà les paroles de notre couplet :</div>
      {activity.data.verseLyrics.map((el, index) => (
        <SyllableEditor key={`syllableEditor--verseLyrics--${index}`} backline={el.back} index={index} data={activity.data.verseLyrics} song />
      ))}
      <div>
        <audio controls src={activity.data.verse} />
      </div>
    </div>
  );
};
