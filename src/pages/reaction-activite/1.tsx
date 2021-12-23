import { useRouter } from 'next/router';
import React from 'react';

import { isReaction } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ActivitySelect } from 'src/components/activities/ActivitySelect';
import { DESC } from 'src/components/activities/utils';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';

interface SelectedActivityInfos {
  id: number | null;
  type: number | null;
}

const ReactionStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [selectedActivity, setSelectedActivity] = React.useState<SelectedActivityInfos>({ id: null, type: null });
  const activitiesTypes = [1, 2, 3, 4];

  const onNext = (clear: boolean) => () => {
    if (clear) {
      updateActivity({ responseActivityId: null, responseType: null });
    }
    router.push('/reaction-activite/2');
  };

  const onChange = (id: number | null, type: number | null) => {
    if (activity !== null) {
      updateActivity({ responseActivityId: id, responseType: type });
      setSelectedActivity({ id, type });
    }
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      const responseActivityId = 'responseActivityId' in router.query ? parseInt(getQueryString(router.query.responseActivityId), 10) ?? null : null;
      const responseActivityType =
        'responseActivityType' in router.query ? parseInt(getQueryString(router.query.responseActivityType), 10) ?? null : null;
      setSelectedActivity({ id: responseActivityId, type: responseActivityType });
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.REACTION, undefined, {}, responseActivityId, responseActivityType);
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else if (activity && !isReaction(activity)) {
        created.current = true;
        createNewActivity(ActivityType.REACTION, undefined, {}, responseActivityId, responseActivityType);
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  }, [activity, createNewActivity, router]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Activité', 'Réaction', 'Prévisualisation']} activeStep={0} />
        <div className="width-900">
          <h1>Réagir à une activité</h1>
          <p>Quand un simple texte ne suffit plus, vous pouvez réagir à une activité déjà publiée par vos Pélicopains.</p>
          <div ref={selectRef}>
            {activitiesTypes.map((type, idx) => (
              <ActivitySelect
                key={idx}
                value={selectedActivity.type === type ? selectedActivity.id : null}
                onChange={onChange}
                onSelect={onNext(false)}
                style={{ margin: '1rem 0 0 0' }}
                label={`Réagir à ${DESC[type]}`}
                type={type}
              />
            ))}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default ReactionStep1;
